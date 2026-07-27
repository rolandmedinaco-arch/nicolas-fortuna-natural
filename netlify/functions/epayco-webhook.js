// netlify/functions/epayco-webhook.js
// Webhook que ePayco llama cuando se confirma un pago
// Actualiza el estado del pedido en Supabase

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

export default async (req) => {
  try {
    // ePayco envía datos por GET o POST
    let params
    if (req.method === 'GET') {
      const url = new URL(req.url)
      params = Object.fromEntries(url.searchParams)
    } else {
      params = await req.json()
    }

    const {
      x_ref_payco,        // Referencia ePayco
      x_transaction_id,   // ID de transacción
      x_amount,           // Monto pagado
      x_currency_code,    // Moneda (COP)
      x_response,         // Respuesta: Aceptada, Rechazada, Pendiente
      x_approval_code,    // Código de aprobación
      x_franchise,        // Franquicia (Visa, Mastercard, PSE, etc.)
      x_id_invoice,       // ID de factura (nuestro order_id)
      x_description,      // Descripción del pago
      x_extra1,           // Campo extra (order_id)
      x_cod_response      // Código: 1=Aceptada, 2=Rechazada, 3=Pendiente, 4=Fallida
    } = params

    console.log('ePayco webhook received:', {
      ref: x_ref_payco,
      response: x_response,
      cod_response: x_cod_response,
      order_id: x_extra1 || x_id_invoice
    })

    // Mapear código de respuesta de ePayco a nuestro estado
    let paymentStatus = 'pending'
    let orderStatus = 'pending'

    switch (String(x_cod_response)) {
      case '1': // Aceptada
        paymentStatus = 'approved'
        orderStatus = 'paid'
        break
      case '2': // Rechazada
        paymentStatus = 'rejected'
        orderStatus = 'cancelled'
        break
      case '3': // Pendiente
        paymentStatus = 'pending'
        orderStatus = 'pending'
        break
      case '4': // Fallida
        paymentStatus = 'failed'
        orderStatus = 'cancelled'
        break
    }

    // Buscar el pedido por order_id o por referencia ePayco
    const orderId = x_extra1 || x_id_invoice

    if (orderId) {
      // Actualizar pedido existente
      const { data, error } = await supabase
        .from('orders')
        .update({
          epayco_ref: x_ref_payco,
          epayco_transaction_id: x_transaction_id,
          epayco_response: x_response,
          payment_method: x_franchise,
          payment_status: paymentStatus,
          status: orderStatus
        })
        .eq('id', orderId)
        .select()

      if (error) {
        console.error('Error updating order:', error)
      } else {
        console.log('Order updated successfully:', data)
      }
    } else if (x_ref_payco) {
      // Si no tenemos order_id, buscar por referencia ePayco
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('epayco_ref', x_ref_payco)
        .single()

      if (existing) {
        await supabase
          .from('orders')
          .update({
            epayco_transaction_id: x_transaction_id,
            epayco_response: x_response,
            payment_method: x_franchise,
            payment_status: paymentStatus,
            status: orderStatus
          })
          .eq('id', existing.id)
      }
    }

    // ePayco espera una respuesta 200
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: 'Webhook error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}