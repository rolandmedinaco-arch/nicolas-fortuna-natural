// netlify/functions/generate-label.js
// Genera guía de envío automáticamente después del pago
// Llama a Envia.com POST /ship/generate/ con los datos del pedido

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const ENVIA_API_KEY = process.env.ENVIA_API_KEY
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY

  try {
    const { order_id } = await req.json()

    if (!order_id) {
      return new Response(JSON.stringify({ error: 'order_id requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // ─── 1. Obtener el pedido de Supabase ───
    const orderRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`
        }
      }
    )
    const orders = await orderRes.json()

    if (!orders || orders.length === 0) {
      console.error('Pedido no encontrado:', order_id)
      return new Response(JSON.stringify({ error: 'Pedido no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const order = orders[0]

    // Verificar que no tiene guía ya
    if (order.tracking_number) {
      console.log('Guía ya generada para pedido:', order_id)
      return new Response(JSON.stringify({
        success: true,
        already_generated: true,
        tracking_number: order.tracking_number,
        label_url: order.label_url
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // ─── 2. Preparar datos para Envia.com ───
    const originDane = '05001000'
    let destDane = order.destination_dane || ''
    if (destDane.length === 5) destDane = destDane + '000'

    const stateMap = {
      '05': 'AN', '08': 'AT', '11': 'DC', '13': 'BL', '15': 'BY',
      '17': 'CL', '18': 'CQ', '19': 'CA', '20': 'CE', '23': 'CO',
      '25': 'CU', '27': 'CH', '41': 'HU', '44': 'LG', '47': 'MA',
      '50': 'ME', '52': 'NA', '54': 'NS', '63': 'QU', '66': 'RI',
      '68': 'SA', '70': 'SU', '73': 'TO', '76': 'VC', '81': 'AR',
      '85': 'CS', '86': 'PU', '88': 'SAP', '91': 'AM', '94': 'GN',
      '95': 'GV', '97': 'VA', '99': 'VI'
    }
    const destStateCode = stateMap[destDane.substring(0, 2)] || 'CU'

    const PRODUCT_WEIGHTS = {
      'esplendor': 0.026, 'biodrenante': 0.125, 'biodrenantes': 0.125,
      'plata coloidal': 0.210, 'coloidal': 0.210, 'default': 0.125
    }

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
    let totalWeight = 0.1
    items.forEach(item => {
      const qty = item.quantity || 1
      const itemName = (item.name || '').toLowerCase()
      let unitWeight = PRODUCT_WEIGHTS['default']
      for (const [key, weight] of Object.entries(PRODUCT_WEIGHTS)) {
        if (key !== 'default' && itemName.includes(key)) { unitWeight = weight; break }
      }
      totalWeight += unitWeight * qty
    })
    totalWeight = Math.max(Math.round(totalWeight * 100) / 100, 0.5)

    const BOXES = [
      { length: 17, width: 8,  height: 10, maxWeight: 0.3 },
      { length: 17, width: 9,  height: 9,  maxWeight: 0.5 },
      { length: 17, width: 8,  height: 14, maxWeight: 0.7 },
      { length: 17, width: 9,  height: 15, maxWeight: 1.0 },
      { length: 30, width: 15, height: 10, maxWeight: 2.0 },
      { length: 23, width: 18, height: 25, maxWeight: 3.0 },
      { length: 33, width: 27, height: 18, maxWeight: 6.0 },
    ]
    let box = BOXES[BOXES.length - 1]
    for (const b of BOXES) { if (totalWeight <= b.maxWeight) { box = b; break } }

    const contentDesc = items.map(i => `${i.name} x${i.quantity || 1}`).join(', ')

    // ─── 3. Llamar a Envia.com ───
    const labelBody = {
      origin: {
        name: 'Fortuna Natural',
        company: 'Fortuna Natural',
        email: 'soynicogil@gmail.com',
        phone: '3000000000',
        street: 'Calle 51 # 82-190',
        city: originDane,
        state: 'AN',
        country: 'CO',
        postalCode: originDane
      },
      destination: {
        name: `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim() || 'Cliente',
        email: order.customer_email || '',
        phone: order.customer_phone || '3000000000',
        street: order.shipping_address || 'Dirección por confirmar',
        street2: order.shipping_address_extra || '',
        city: destDane,
        state: destStateCode,
        country: 'CO',
        postalCode: destDane
      },
      packages: [{
        content: contentDesc || 'Productos naturales',
        amount: 1,
        type: 'box',
        weight: totalWeight,
        weightUnit: 'KG',
        lengthUnit: 'CM',
        dimensions: { length: box.length, width: box.width, height: box.height },
        declaredValue: order.total || 50000,
        insurance: 0
      }],
      shipment: {
        type: 1,
        carrier: (order.shipping_carrier_code || 'coordinadora').toLowerCase(),
        service: order.shipping_service_code || ''
      },
      settings: {
        printFormat: 'PDF',
        printSize: 'STOCK_4X6',
        comments: `Pedido #${order_id}`
      }
    }

    console.log('Generando guía para pedido:', order_id)

    const enviaRes = await fetch('https://api.envia.com/ship/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENVIA_API_KEY}`
      },
      body: JSON.stringify(labelBody)
    })

    const enviaData = await enviaRes.json()
    console.log('Envia.com generate response:', JSON.stringify(enviaData).substring(0, 500))

    // ─── 4. Procesar respuesta ───
    let trackingNumber = null
    let labelUrl = null
    let trackUrl = null

    if (enviaData.data && enviaData.data.length > 0) {
      const shipment = enviaData.data[0]
      trackingNumber = shipment.trackingNumber || shipment.tracking_number || null
      labelUrl = shipment.label || shipment.labelUrl || null
      trackUrl = shipment.trackUrl || shipment.track_url || null
    }

    if (!trackingNumber) {
      console.error('No se pudo generar guía:', JSON.stringify(enviaData))
      await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          shipping_status: 'label_error',
          shipping_error: JSON.stringify(enviaData).substring(0, 500)
        })
      })

      return new Response(JSON.stringify({
        success: false,
        error: 'No se pudo generar la guía',
        details: enviaData
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // ─── 5. Guardar tracking en Supabase ───
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        tracking_number: trackingNumber,
        label_url: labelUrl,
        track_url: trackUrl,
        shipping_status: 'label_generated',
        shipped_at: new Date().toISOString()
      })
    })

    console.log(`✅ Guía generada: ${trackingNumber} | Label: ${labelUrl}`)

    return new Response(JSON.stringify({
      success: true,
      tracking_number: trackingNumber,
      label_url: labelUrl,
      track_url: trackUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Generate label error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}