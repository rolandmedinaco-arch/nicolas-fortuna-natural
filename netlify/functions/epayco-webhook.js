// netlify/functions/epayco-webhook.js
// Webhook que ePayco llama cuando se confirma un pago
// Actualiza el estado del pedido en Supabase
// NUEVO: Genera guía automáticamente cuando el pago es aprobado

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
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_currency_code,
      x_response,
      x_approval_code,
      x_franchise,
      x_id_invoice,
      x_description,
      x_extra1,
      x_cod_response
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
      case '1':
        paymentStatus = 'approved'
        orderStatus = 'paid'
        break
      case '2':
        paymentStatus = 'rejected'
        orderStatus = 'rejected'
        break
      case '3':
        paymentStatus = 'pending'
        orderStatus = 'pending'
        break
      case '4':
        paymentStatus = 'failed'
        orderStatus = 'failed'
        break
      default:
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
          status: orderStatus,
        })
        .eq('id', orderId)
        .select()

      if (error) {
        console.error('Error updating order:', error)
      } else {
        console.log('Order updated successfully:', data)

        // ─── NUEVO: Generar guía automáticamente si el pago fue aprobado ───
        if (paymentStatus === 'approved' && data && data.length > 0) {
          const order = data[0]

          // Solo generar si tiene carrier seleccionado y no tiene guía aún
          if (order.shipping_carrier_code && !order.tracking_number) {
            console.log('🚚 Generando guía automática para pedido:', orderId)

            try {
              // Llamar a la función generate-label
              const labelRes = await fetch(
                `${new URL(req.url).origin}/.netlify/functions/generate-label`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ order_id: orderId })
                }
              )
              const labelData = await labelRes.json()

              if (labelData.success) {
                console.log('✅ Guía generada:', labelData.tracking_number)
              } else {
                console.error('⚠️ Error generando guía:', labelData.error || labelData.details)
              }
            } catch (labelError) {
              console.error('❌ Error llamando generate-label:', labelError)
              // No falla el webhook — la guía se puede generar manualmente después
            }
          }
        }
      }
    } else if (x_ref_payco) {
      // Si no tenemos order_id, buscar por referencia ePayco
      const { data: existingOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('epayco_ref', x_ref_payco)

      if (existingOrders && existingOrders.length > 0) {
        await supabase
          .from('orders')
          .update({
            epayco_transaction_id: x_transaction_id,
            epayco_response: x_response,
            payment_method: x_franchise,
            payment_status: paymentStatus,
            status: orderStatus,
          })
          .eq('epayco_ref', x_ref_payco)
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}