// netlify/functions/shipping-quote.js
// Cotiza envíos con múltiples transportadoras usando Envia.com API
// Devuelve solo las 3 opciones más económicas con colores de marca

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

    if (!ENVIA_API_KEY) {
      return new Response(JSON.stringify({
        carriers: [{
          carrier: 'Envío estándar',
          service: 'Estándar',
          delivery_time: '5-7 días hábiles',
          price: 15000,
          currency: 'COP',
          color: '#888780',
          initials: 'EN'
        }],
        fallback: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // ─── Pesos reales (kg) ───
    const PRODUCT_WEIGHTS = {
      'esplendor': 0.026,
      'biodrenante': 0.125,
      'biodrenantes': 0.125,
      'plata coloidal': 0.210,
      'plata_coloidal': 0.210,
      'coloidal': 0.210,
      'default': 0.125
    }

    // ─── Cajas ───
    const BOXES = [
      { name: 'XS',  length: 17, width: 8,  height: 10, maxWeight: 0.3 },
      { name: 'S',   length: 17, width: 9,  height: 9,  maxWeight: 0.5 },
      { name: 'M',   length: 17, width: 8,  height: 14, maxWeight: 0.7 },
      { name: 'L',   length: 17, width: 9,  height: 15, maxWeight: 1.0 },
      { name: 'XL',  length: 30, width: 15, height: 10, maxWeight: 2.0 },
      { name: 'XXL', length: 23, width: 18, height: 25, maxWeight: 3.0 },
      { name: 'MAX', length: 33, width: 27, height: 18, maxWeight: 6.0 },
    ]

    // ─── Colores de marca e iniciales de cada transportadora ───
    const CARRIER_BRAND = {
      'coordinadora': { color: '#0033A0', initials: 'CO' },
      'servientrega': { color: '#009639', initials: 'SE' },
      'tcc':          { color: '#E31837', initials: 'TCC' },
      'interrapidisimo': { color: '#1B1464', initials: 'IR' },
    }

    // ─── Calcular peso ───
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
      totalWeight = 0.151
    }
    totalWeight += 0.1
    totalWeight = Math.round(totalWeight * 100) / 100

    let selectedBox = BOXES[BOXES.length - 1]
    for (const box of BOXES) {
      if (totalWeight <= box.maxWeight) {
        selectedBox = box
        break
      }
    }

    // ─── DANE ───
    const originDane = '05001000'
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

    const origin = {
      name: 'Fortuna Natural',
      company: 'Fortuna Natural',
      email: 'soynicogil@gmail.com',
      phone: '3000000000',
      street: 'Calle 51 # 82-190',
      city: originDane,
      state: 'AN',
      country: 'CO',
      postalCode: originDane
    }

    const destination = {
      name: 'Cliente',
      phone: '3000000000',
      street: 'Dirección por confirmar',
      city: destDane,
      state: destStateCode,
      country: 'CO',
      postalCode: destDane
    }

    const packages = [{
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
    }]

    // ─── Carriers activos ───
    const CARRIERS = ['coordinadora', 'servientrega', 'tcc', 'interrapidisimo']

    const ratePromises = CARRIERS.map(carrier =>
      fetch('https://api.envia.com/ship/rate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ENVIA_API_KEY}`
        },
        body: JSON.stringify({
          origin,
          destination,
          packages,
          shipment: { type: 1, carrier }
        })
      })
      .then(res => res.json())
      .then(data => ({ carrier, data, success: true }))
      .catch(err => ({ carrier, error: err.message, success: false }))
    )

    const results = await Promise.allSettled(ratePromises)

    // ─── Recopilar opciones ───
    const allCarriers = []
    const seenKeys = new Set()

    for (const result of results) {
      if (result.status !== 'fulfilled' || !result.value.success) continue
      const { carrier, data } = result.value
      const options = Array.isArray(data) ? data
        : (data.data && Array.isArray(data.data)) ? data.data
        : []

      const brand = CARRIER_BRAND[carrier] || { color: '#888780', initials: '?' }

      for (const option of options) {
        const price = parseFloat(option.totalPrice || option.price || 0)
        if (price <= 0) continue

        const carrierName = formatCarrierName(option.carrier || carrier)
        const serviceName = formatServiceName(option.service || option.serviceDescription || '')

        const key = `${carrierName}-${Math.round(price)}`
        if (seenKeys.has(key)) continue
        seenKeys.add(key)

        allCarriers.push({
          carrier: carrierName,
          carrier_code: carrier, 
          service: serviceName,
          delivery_time: option.deliveryEstimate || option.days || '3-5 días hábiles',
          price: Math.round(price),
          currency: option.currency || 'COP',
          color: brand.color,
          initials: brand.initials,
          service_id: option.service_id || option.serviceId || ''
        })
      }
    }

    // Ordenar por precio y tomar solo las 3 más baratas
    allCarriers.sort((a, b) => a.price - b.price)
    const top3 = allCarriers.slice(0, 3)

    if (top3.length > 0) {
      top3[0].recommended = true
      return new Response(JSON.stringify({
        carriers: top3,
        fallback: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      carriers: [{
        carrier: 'Envío estándar',
        service: 'Estándar',
        delivery_time: '5-7 días hábiles',
        price: 15000,
        currency: 'COP',
        color: '#888780',
        initials: 'EN'
      }],
      fallback: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Shipping quote error:', error)
    return new Response(JSON.stringify({
      carriers: [{
        carrier: 'Envío estándar',
        service: 'Estándar',
        delivery_time: '5-7 días hábiles',
        price: 15000,
        currency: 'COP',
        color: '#888780',
        initials: 'EN'
      }],
      fallback: true
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

function formatServiceName(service) {
  if (!service) return 'Estándar'
  const lower = service.toLowerCase()
  if (lower.includes('ground')) return 'Terrestre'
  if (lower.includes('ecommerce') || lower.includes('e-commerce')) return 'E-commerce'
  if (lower.includes('express')) return 'Express'
  if (lower.includes('premier')) return 'Premier'
  if (lower.includes('mensajeria')) return 'Mensajería'
  if (lower.includes('domicilio')) return 'Domicilio'
  if (lower.includes('standard') || lower.includes('estandar')) return 'Estándar'
  return service.charAt(0).toUpperCase() + service.slice(1)
}