// netlify/functions/shipping-quote.js
// Cotiza envíos con múltiples transportadoras usando Envia.com API
// Formato correcto para Colombia con códigos DANE
// Pesos y cajas reales de Fortuna Natural

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const ENVIA_API_KEY = process.env.ENVIA_API_KEY

  try {
    const body = await req.json()
    const { destination_dane_code, items } = body

    // Si no hay API key, devolver tarifa plana
    if (!ENVIA_API_KEY) {
      console.log('No ENVIA_API_KEY configured')
      return new Response(JSON.stringify({
        carriers: [{
          carrier: 'Envío estándar',
          service: 'standard',
          delivery_time: '5-7 días hábiles',
          price: 15000,
          currency: 'COP'
        }],
        fallback: true,
        message: 'Tarifa plana (API key no configurada)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // ─── Pesos reales de los productos (en kg) ───
    const PRODUCT_WEIGHTS = {
      'esplendor': 0.026,        // 26g
      'biodrenante': 0.125,      // 125g
      'biodrenantes': 0.125,
      'plata coloidal': 0.210,   // 210g
      'plata_coloidal': 0.210,
      'coloidal': 0.210,
      'default': 0.125           // Peso promedio si no se reconoce
    }

    // ─── Cajas disponibles (de menor a mayor) ───
    // Coinciden con los paquetes guardados en Envia.com
    const BOXES = [
      { name: 'XS',  length: 17, width: 8,  height: 10, maxWeight: 0.3 },
      { name: 'S',   length: 17, width: 9,  height: 9,  maxWeight: 0.5 },
      { name: 'M',   length: 17, width: 8,  height: 14, maxWeight: 0.7 },
      { name: 'L',   length: 17, width: 9,  height: 15, maxWeight: 1.0 },
      { name: 'XL',  length: 30, width: 15, height: 10, maxWeight: 2.0 },
      { name: 'XXL', length: 23, width: 18, height: 25, maxWeight: 3.0 },
      { name: 'MAX', length: 33, width: 27, height: 18, maxWeight: 6.0 },
    ]

    // ─── Calcular peso total del pedido ───
    let totalWeight = 0
    if (items && items.length > 0) {
      items.forEach(item => {
        const qty = item.quantity || 1
        const itemName = (item.name || item.slug || '').toLowerCase()
        let unitWeight = PRODUCT_WEIGHTS['default']
        for (const [key, weight] of Object.entries(PRODUCT_WEIGHTS)) {
          if (key !== 'default' && itemName.includes(key)) {
            unitWeight = weight
            break
          }
        }
        totalWeight += unitWeight * qty
      })
    } else {
      totalWeight = 0.151 // 1 Esplendor + 1 Biodrenante
    }

    // Agregar peso del empaque (~100g)
    totalWeight += 0.1
    totalWeight = Math.round(totalWeight * 100) / 100

    // ─── Seleccionar caja adecuada ───
    let selectedBox = BOXES[BOXES.length - 1]
    for (const box of BOXES) {
      if (totalWeight <= box.maxWeight) {
        selectedBox = box
        break
      }
    }

    // ─── Códigos DANE ───
    const originDane = '05001000' // Medellín (8 dígitos)

    let destDane = destination_dane_code || ''
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

    // ─── Request body para Envia.com (Colombia) ───
    // city y postalCode = código DANE (iguales)
    const requestBody = {
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
        name: 'Cliente',
        phone: '3000000000',
        street: 'Dirección por confirmar',
        city: destDane,
        state: destStateCode,
        country: 'CO',
        postalCode: destDane
      },
      packages: [{
        content: 'Productos naturales',
        amount: 1,
        type: 'box',
        weight: Math.max(totalWeight, 0.5),
        weightUnit: 'KG',
        lengthUnit: 'CM',
        dimensions: {
          length: selectedBox.length,
          width: selectedBox.width,
          height: selectedBox.height
        },
        declaredValue: 50000
      }],
      shipment: {
        type: 1
      }
    }

    console.log('Envia.com request:', JSON.stringify(requestBody))
    console.log(`Peso: ${totalWeight}kg | Caja: ${selectedBox.name} (${selectedBox.length}x${selectedBox.width}x${selectedBox.height})`)

    const enviaResponse = await fetch('https://api.envia.com/ship/rate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENVIA_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    const enviaData = await enviaResponse.json()
    console.log('Envia.com status:', enviaResponse.status)
    console.log('Envia.com response:', JSON.stringify(enviaData))

    // Respuesta puede ser array directo o envuelto en .data
    const rawOptions = Array.isArray(enviaData) ? enviaData
      : (enviaData.data && Array.isArray(enviaData.data)) ? enviaData.data
      : []

    if (rawOptions.length > 0) {
      const carriers = rawOptions
        .filter(option => option.price && option.price > 0)
        .map(option => ({
          carrier: formatCarrierName(option.carrier),
          service: option.service || 'Estándar',
          delivery_time: option.days || option.delivery_time || option.deliveryEstimate || '3-7 días hábiles',
          price: Math.round(option.price || option.totalPrice || option.basePrice || 0),
          currency: option.currency || 'COP',
          service_id: option.service_id || option.serviceId || ''
        }))
        .sort((a, b) => a.price - b.price)

      if (carriers.length > 0) {
        return new Response(JSON.stringify({
          carriers,
          fallback: false,
          debug: { weight: totalWeight, box: selectedBox.name, destDane }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Fallback
    console.log('Envia.com: sin opciones válidas')
    return new Response(JSON.stringify({
      carriers: [{
        carrier: 'Envío estándar',
        service: 'standard',
        delivery_time: '5-7 días hábiles',
        price: 15000,
        currency: 'COP'
      }],
      fallback: true,
      debug: { status: enviaResponse.status, response: enviaData, weight: totalWeight, box: selectedBox.name, destDane }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Shipping quote error:', error)
    return new Response(JSON.stringify({
      carriers: [{
        carrier: 'Envío estándar',
        service: 'standard',
        delivery_time: '5-7 días hábiles',
        price: 15000,
        currency: 'COP'
      }],
      fallback: true,
      message: 'Error al cotizar'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function formatCarrierName(name) {
  if (!name) return 'Transportadora'
  const names = {
    'coordinadora': 'Coordinadora',
    'serviEntrega': 'Servientrega',
    'servientrega': 'Servientrega',
    'interrapidisimo': 'Inter Rapidísimo',
    'interRapidisimo': 'Inter Rapidísimo',
    'tcc': 'TCC',
    'envia': 'Envía',
    'fedex': 'FedEx',
    'dhl': 'DHL',
    'deprisa': 'Deprisa',
    'redServi': 'RedServi'
  }
  return names[name] || name.charAt(0).toUpperCase() + name.slice(1)
}