// netlify/functions/shipping-quote.js
// Serverless function to quote shipping rates via Envia.com API
// The API key stays secure on the server — never exposed to the frontend

export default async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json()
    const { city, state, postalCode } = body

    if (!city || !state) {
      return new Response(JSON.stringify({ error: 'city and state are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const ENVIA_API_KEY = process.env.ENVIA_API_KEY

    if (!ENVIA_API_KEY) {
      // If no API key configured, return default flat rate
      return new Response(JSON.stringify({
        rates: [{
          carrier: 'Envío estándar',
          service: 'standard',
          price: 15000,
          currency: 'COP',
          deliveryDays: '5-7 días hábiles',
          logo: null
        }],
        fallback: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fortuna Natural origin address (update with client's real warehouse address)
    const origin = {
      name: 'Fortuna Natural',
      company: 'Fortuna Natural',
      phone: '+573145397257',
      street: 'Dirección del almacén', // TODO: Update with real address
      city: '05001', // Medellín DANE code — update if different
      state: 'AN', // Antioquia
      country: 'CO',
      postalCode: '05001'
    }

    const destination = {
      name: 'Cliente',
      phone: '+573000000000',
      street: 'Dirección del cliente',
      city: postalCode || city, // For Colombia: use DANE code
      state: state,
      country: 'CO',
      postalCode: postalCode || city
    }

    // Package defaults for Fortuna Natural products (small bottles)
    const packages = [{
      content: 'Productos naturales',
      amount: 1,
      type: 'box',
      weight: 1, // kg
      insurance: 0,
      declaredValue: 140000,
      weightUnit: 'KG',
      lengthUnit: 'CM',
      dimensions: {
        length: 15,
        width: 10,
        height: 10
      }
    }]

    // Call Envia.com API to get rates
    // Note: Envia requires one request per carrier
    // We'll query the most common Colombian carriers
    const carriers = ['servientrega', 'coordinadora', 'interrapidisimo', 'envia']
    const ratePromises = carriers.map(carrier =>
      fetchCarrierRate(ENVIA_API_KEY, origin, destination, packages, carrier)
    )

    const results = await Promise.allSettled(ratePromises)

    const rates = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)
      .flat()
      .sort((a, b) => a.price - b.price)

    // If no rates found, return flat rate fallback
    if (rates.length === 0) {
      return new Response(JSON.stringify({
        rates: [{
          carrier: 'Envío estándar',
          service: 'standard',
          price: 15000,
          currency: 'COP',
          deliveryDays: '5-7 días hábiles',
          logo: null
        }],
        fallback: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ rates, fallback: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Shipping quote error:', error)
    return new Response(JSON.stringify({
      error: 'Error fetching shipping rates',
      rates: [{
        carrier: 'Envío estándar',
        service: 'standard',
        price: 15000,
        currency: 'COP',
        deliveryDays: '5-7 días hábiles',
        logo: null
      }],
      fallback: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function fetchCarrierRate(apiKey, origin, destination, packages, carrier) {
  try {
    const response = await fetch('https://api.envia.com/ship/rate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        origin,
        destination,
        packages,
        shipment: {
          carrier: carrier,
          type: 1 // domestic
        }
      })
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) return null

    return data.data.map(rate => ({
      carrier: rate.carrier || carrier,
      carrierName: rate.carrierDescription || carrier,
      service: rate.serviceDescription || 'Estándar',
      serviceCode: rate.serviceCode || '',
      price: Math.round(rate.totalPrice || rate.basePrice || 0),
      currency: 'COP',
      deliveryDays: rate.deliveryEstimate
        ? `${rate.deliveryEstimate.transitDays || '3-5'} días hábiles`
        : '3-5 días hábiles',
      logo: rate.carrierLogo || null
    }))
  } catch (error) {
    console.error(`Error fetching ${carrier} rate:`, error.message)
    return null
  }
}

export const config = {
  path: '/api/shipping-quote'
}