// netlify/functions/create-order.js
// Guarda un pedido en Supabase cuando el usuario inicia el pago

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

export default async (req) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json()

    const {
      email,
      phone,
      firstName,
      lastName,
      cedula,
      address,
      addressExtra,
      department,
      city,
      postalCode,
      items,
      subtotal,
      discountPercent,
      discountAmount,
      shippingCost,
      total,
      shippingMethod
    } = body

    // Validación básica
    if (!email || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Email y productos son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Insertar pedido en Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_email: email,
        customer_phone: phone,
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_cedula: cedula,
        shipping_address: address,
        shipping_address_extra: addressExtra,
        shipping_department: department,
        shipping_city: city,
        shipping_postal_code: postalCode,
        items: items,
        subtotal: subtotal,
        discount_percent: discountPercent || 0,
        discount_amount: discountAmount || 0,
        shipping_cost: shippingCost || 0,
        total: total,
        shipping_method: shippingMethod || 'standard',
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return new Response(JSON.stringify({ error: 'Error guardando pedido' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      order_id: data.id,
      message: 'Pedido creado exitosamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Server error:', err)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}