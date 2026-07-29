// netlify/functions/shipping-quote.js
// Cotiza envíos con múltiples transportadoras usando Envia.com API
// Formato correcto para Colombia con códigos DANE

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
        message: 'API key no configurada'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Calcular peso y dimensiones
    let totalWeight = 0
    let totalHeight = 0
    if (items && items.length > 0) {
      items.forEach(item => {
        const qty = item.quantity || 1
        totalWeight += (item.weight || 0.5) * qty
        totalHeight += (item.height || 10) * qty
      })
    } else {
      totalWeight = 1
      totalHeight = 15
    }

    // Origen: Medellín (DANE 05001)
    const originDane = '05001'

    // Formato correcto para Colombia
    const requestBody = {
      origin: {
        country: 'CO',
        postal_code: originDane
      },
      destination: {
        country: 'CO',
        postal_code: destination_dane_code
      },
      packages: [{
        weight: Math.max(Math.round(totalWeight * 10) / 10, 0.5),
        height: Math.min(Math.round(totalHeight), 50),
        width: 20,
        length: 20,
        type: 'box'
      }],
      carriers: [
        'coordinadora',
        'serviEntrega',
        'interrapidisimo',
        'tcc',
        'envia'
      ],
      insurance: 0,
      type: 'National'
    }

    console.log('Envia.com request:', JSON.stringify(requestBody))

    const enviaResponse = await fetch('https://api.envia.com/ship/rate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENVIA_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    const enviaData = await enviaResponse.json()
    console.log('Envia.com response:', JSON.stringify(enviaData))

    // Procesar respuesta - puede ser un array de opciones
    if (Array.isArray(enviaData) && enviaData.length > 0) {
      const carriers = enviaData
        .filter(option => option.price && option.price > 0)
        .map(option => ({
          carrier: formatCarrierName(option.carrier),
          service: option.service || 'Estándar',
          delivery_time: option.days || option.delivery_time || '3-7 días hábiles',
          price: Math.round(option.price),
          currency: option.currency || 'COP',
          service_id: option.service_id || ''
        }))
        .sort((a, b) => a.price - b.price)

      if (carriers.length > 0) {
        return new Response(JSON.stringify({
          carriers: carriers,
          fallback: false
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Si la respuesta tiene campo 'data' (otro formato posible)
    if (enviaData.data && Array.isArray(enviaData.data) && enviaData.data.length > 0) {
      const carriers = enviaData.data
        .filter(option => (option.totalPrice || option.price) > 0)
        .map(option => ({
          carrier: formatCarrierName(option.carrier_name || option.carrier),
          service: option.service || option.serviceDescription || 'Estándar',
          delivery_time: option.days || option.deliveryEstimate 
            ? `${option.deliveryEstimate?.min || '?'}-${option.deliveryEstimate?.max || '?'} días`
            : '3-7 días hábiles',
          price: Math.round(option.totalPrice || option.price),
          currency: 'COP',
          service_id: option.serviceId || option.service_id || ''
        }))
        .sort((a, b) => a.price - b.price)

      if (carriers.length > 0) {
        return new Response(JSON.stringify({
          carriers: carriers,
          fallback: false
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Si no hay resultados, fallback
    console.log('No carrier results found in response')
    return new Response(JSON.stringify({
      carriers: [{
        carrier: 'Envío estándar',
        service: 'standard',
        delivery_time: '5-7 días hábiles',
        price: 15000,
        currency: 'COP'
      }],
      fallback: true,
      message: 'No se encontraron opciones para este destino'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Shipping quote error:', err)
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