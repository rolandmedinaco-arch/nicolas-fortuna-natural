// netlify/functions/shipping-quote.js
// Cotiza envíos con múltiples transportadoras usando Envia.com API
// Devuelve todas las opciones para que el cliente escoja

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
      return new Response(JSON.stringify({
        carriers: [{
          carrier: 'Envío estándar',
          service: 'standard',
          delivery_time: '5-7 días hábiles',
          price: 15000,
          currency: 'COP'
        }],
        fallback: true,
        message: 'API key no configurada, tarifa plana aplicada'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Calcular peso y dimensiones totales
    let totalWeight = 0
    let totalHeight = 0
    const maxWidth = 30
    const maxLength = 30

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

    // Calcular valor declarado
    const declaredValue = items 
      ? items.reduce((sum, item) => sum + (item.price || 50000) * (item.quantity || 1), 0) 
      : 50000

    // Origen: Medellín (DANE 05001)
    const originDane = '05001'

    // Llamar API de Envia.com
    const enviaResponse = await fetch('https://api.envia.com/ship/rate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENVIA_API_KEY}`
      },
      body: JSON.stringify({
        origin: {
          name: 'Fortuna Natural',
          company: 'Fortuna Natural',
          email: 'soynicogil@gmail.com',
          phone: '3143049102',
          street: 'Medellín',
          number: 'S/N',
          district: 'Medellín',
          city: originDane,
          state: 'AN',
          country: 'CO',
          postalCode: originDane,
          reference: ''
        },
        destination: {
          name: 'Cliente',
          company: '',
          email: '',
          phone: '',
          street: 'Dirección del cliente',
          number: 'S/N',
          district: '',
          city: destination_dane_code,
          state: '',
          country: 'CO',
          postalCode: destination_dane_code,
          reference: ''
        },
        packages: [{
          content: 'Productos naturales',
          amount: 1,
          type: 'box',
          weight: Math.max(totalWeight, 0.5),
          insurance: declaredValue,
          declaredValue: declaredValue,
          weightUnit: 'KG',
          lengthUnit: 'CM',
          dimensions: {
            length: maxLength,
            width: maxWidth,
            height: Math.min(totalHeight, 50)
          }
        }],
        shipment: {
          carrier: 'all',
          type: 1
        },
        settings: {
          printFormat: 'PDF',
          printSize: 'STOCK_4X6',
          currency: 'COP'
        }
      })
    })

    const enviaData = await enviaResponse.json()

    // Procesar respuesta de Envia.com
    if (enviaData.data && enviaData.data.length > 0) {
      const carriers = enviaData.data
        .filter(option => option.totalPrice && option.totalPrice > 0)
        .map(option => ({
          carrier: option.carrier_name || option.carrier || 'Transportadora',
          service: option.service || option.serviceDescription || 'Estándar',
          delivery_time: option.deliveryEstimate 
            ? `${option.deliveryEstimate.min || '?'}-${option.deliveryEstimate.max || '?'} días hábiles`
            : option.delivery_date || '3-7 días hábiles',
          price: Math.round(option.totalPrice),
          currency: 'COP',
          logo: option.carrier_logo || '',
          service_id: option.serviceId || option.service_id || ''
        }))
        .sort((a, b) => a.price - b.price) // Ordenar por precio (más barato primero)

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

    // Si la API no devuelve resultados, fallback
    console.log('Envia.com response:', JSON.stringify(enviaData))
    
    return new Response(JSON.stringify({
      carriers: [{
        carrier: 'Envío estándar',
        service: 'standard',
        delivery_time: '5-7 días hábiles',
        price: 15000,
        currency: 'COP'
      }],
      fallback: true,
      message: 'No se encontraron opciones de envío para este destino'
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
      message: 'Error al cotizar, tarifa estándar aplicada'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}