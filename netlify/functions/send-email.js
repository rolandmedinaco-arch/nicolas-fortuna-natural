// netlify/functions/send-email.js
// Envía emails transaccionales usando Resend.com
// 3 tipos: order_confirmation, admin_notification, shipment_notification

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY no configurada')
    return new Response(JSON.stringify({ error: 'Email no configurado' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { type, order } = await req.json()

    if (!type || !order) {
      return new Response(JSON.stringify({ error: 'type y order requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let emailData = null

    switch (type) {
      case 'order_confirmation':
        emailData = buildOrderConfirmation(order)
        break
      case 'admin_notification':
        emailData = buildAdminNotification(order)
        break
      case 'shipment_notification':
        emailData = buildShipmentNotification(order)
        break
      default:
        return new Response(JSON.stringify({ error: `Tipo de email desconocido: ${type}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
    }

    console.log(`📧 Enviando email [${type}] a ${emailData.to}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
from: 'Fortuna Natural <pedidos@fortunanatural.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html
      })
    })

    const result = await res.json()

    if (res.ok) {
      console.log(`✅ Email enviado:`, result.id)
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      console.error('❌ Error Resend:', result)
      return new Response(JSON.stringify({ success: false, error: result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Send email error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// ─── Helpers ───

function formatCOP(amount) {
  return '$ ' + Number(amount || 0).toLocaleString('es-CO')
}

function parseItems(items) {
  if (typeof items === 'string') {
    try { return JSON.parse(items) } catch { return [] }
  }
  return items || []
}

// ─── Estilos base compartidos ───

const baseStyles = `
  body { margin: 0; padding: 0; background: #f5f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
  .header { background: #1a3c2a; padding: 28px 32px; text-align: center; }
  .header-logo { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; }
  .header-logo span { color: #c0922c; font-style: italic; font-weight: 400; }
  .body { padding: 32px; }
  .greeting { font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px; }
  .intro { font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 24px; }
  .section-title { font-size: 13px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
  .item-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #333; }
  .item-name { flex: 1; }
  .item-qty { color: #888; margin: 0 12px; }
  .item-price { font-weight: 600; white-space: nowrap; }
  .totals { margin-top: 16px; }
  .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
  .total-row.grand { padding-top: 12px; border-top: 2px solid #1a3c2a; font-size: 16px; font-weight: 700; color: #1a3c2a; margin-top: 8px; }
  .info-box { background: #f9faf8; border: 1px solid #e8e8e0; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .info-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.03em; margin: 0 0 2px; }
  .info-value { font-size: 14px; color: #333; font-weight: 500; margin: 0 0 10px; }
  .info-value:last-child { margin-bottom: 0; }
  .btn { display: inline-block; background: #1a3c2a; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
  .footer { padding: 24px 32px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
  .footer a { color: #1a3c2a; }
  .tracking-box { background: #f0faf0; border: 2px solid #2d6a30; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
  .tracking-number { font-size: 20px; font-weight: 700; color: #1a3c2a; letter-spacing: 0.05em; }
  .tracking-label { font-size: 12px; color: #666; margin-bottom: 4px; }
`

// ═══════════════════════════════════════════════════════════
// EMAIL 1: Confirmación de compra al cliente
// ═══════════════════════════════════════════════════════════

function buildOrderConfirmation(order) {
  const items = parseItems(order.items)
  const customerName = order.customer_first_name || 'Cliente'

  const itemsHtml = items.map(item => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:14px;color:#333;">
      <span style="flex:1;">${item.name}</span>
      <span style="color:#888;margin:0 12px;">x${item.quantity || 1}</span>
      <span style="font-weight:600;white-space:nowrap;">${formatCOP(item.price * (item.quantity || 1))}</span>
    </div>
  `).join('')

  const html = `
  <!DOCTYPE html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
  <body style="margin:0;padding:20px;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      
      <div style="background:#1a3c2a;padding:28px 32px;text-align:center;">
        <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">🌿 Fortuna <span style="color:#c0922c;font-style:italic;font-weight:400;">Natural</span></h1>
      </div>

      <div style="padding:32px;">
        <h2 style="font-size:18px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">¡Gracias por tu compra, ${customerName}! 🎉</h2>
        <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 24px;">Tu pedido ha sido recibido y confirmado. Aquí tienes el resumen:</p>

        <p style="font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px;">Productos</p>
        ${itemsHtml}

        <div style="margin-top:16px;">
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#555;">
            <span>Subtotal</span>
            <span>${formatCOP(order.subtotal)}</span>
          </div>
          ${order.discount_amount > 0 ? `
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#c0922c;">
            <span>Descuento (${order.discount_percent}%)</span>
            <span>-${formatCOP(order.discount_amount)}</span>
          </div>` : ''}
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#555;">
            <span>Envío</span>
            <span>${formatCOP(order.shipping_cost)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:12px 0 0;border-top:2px solid #1a3c2a;font-size:16px;font-weight:700;color:#1a3c2a;margin-top:8px;">
            <span>Total</span>
            <span>${formatCOP(order.total)}</span>
          </div>
        </div>

        <div style="background:#f9faf8;border:1px solid #e8e8e0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Enviar a</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0 0 10px;">${order.customer_first_name} ${order.customer_last_name}</p>
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Dirección</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0 0 10px;">${order.shipping_address}${order.shipping_address_extra ? ', ' + order.shipping_address_extra : ''}</p>
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Ciudad</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0;">${order.shipping_city}, ${order.shipping_department}</p>
        </div>

        <p style="font-size:14px;color:#555;line-height:1.6;">Te enviaremos otro email con el número de seguimiento cuando tu pedido sea despachado.</p>
      </div>

      <div style="padding:24px 32px;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee;">
        <p style="margin:0;">Fortuna Natural — Productos naturales para tu bienestar</p>
<a href="https://fortunanatural.com" style="color:#1a3c2a;">fortunanatural.com</a>
      </div>
    </div>
  </body></html>`

  return {
    to: order.customer_email,
    subject: `✅ Pedido confirmado — Fortuna Natural`,
    html
  }
}

// ═══════════════════════════════════════════════════════════
// EMAIL 2: Notificación al admin
// ═══════════════════════════════════════════════════════════

function buildAdminNotification(order) {
  const items = parseItems(order.items)

  const itemsList = items.map(item =>
    `${item.name} x${item.quantity || 1} — ${formatCOP(item.price * (item.quantity || 1))}`
  ).join('<br>')

  const html = `
  <!DOCTYPE html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:20px;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      
      <div style="background:#1a3c2a;padding:20px 32px;text-align:center;">
        <h1 style="color:#fff;font-size:18px;font-weight:700;margin:0;">🛒 Nueva Orden Pagada</h1>
      </div>

      <div style="padding:32px;">
        <h2 style="font-size:18px;font-weight:600;color:#1a1a1a;margin:0 0 16px;">Pedido #${(order.id || '').substring(0, 8)}</h2>

        <div style="background:#f9faf8;border:1px solid #e8e8e0;border-radius:8px;padding:16px;margin:0 0 16px;">
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Cliente</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0 0 10px;">${order.customer_first_name} ${order.customer_last_name}</p>
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Email</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0 0 10px;">${order.customer_email}</p>
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Teléfono</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0 0 10px;">${order.customer_phone}</p>
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Dirección</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0;">${order.shipping_address}, ${order.shipping_city}</p>
        </div>

        <p style="font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Productos</p>
        <p style="font-size:14px;color:#333;line-height:1.8;margin:0 0 16px;">${itemsList}</p>

        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #1a3c2a;font-size:16px;font-weight:700;color:#1a3c2a;">
          <span>Total</span>
          <span>${formatCOP(order.total)}</span>
        </div>

        <div style="text-align:center;margin:24px 0 0;">
          <a href="https://fortunanatural.com/admin" style="display:inline-block;background:#1a3c2a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Ver en Admin</a>
          <br><br>
          <a href="https://wa.me/57${(order.customer_phone || '').replace(/\D/g, '')}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">WhatsApp al cliente</a>
        </div>
      </div>
    </div>
  </body></html>`

  return {
    to: 'soynicogil@gmail.com',
    subject: `🛒 Nueva orden: ${order.customer_first_name} ${order.customer_last_name} — ${formatCOP(order.total)}`,
    html
  }
}

// ═══════════════════════════════════════════════════════════
// EMAIL 3: Notificación de despacho con tracking
// ═══════════════════════════════════════════════════════════

function buildShipmentNotification(order) {
  const customerName = order.customer_first_name || 'Cliente'
  const trackingNumber = order.tracking_number || 'Pendiente'
  const trackUrl = order.track_url || '#'
  const carrier = order.shipping_carrier_code || 'Transportadora'

  const html = `
  <!DOCTYPE html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:20px;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      
      <div style="background:#1a3c2a;padding:28px 32px;text-align:center;">
        <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">🌿 Fortuna <span style="color:#c0922c;font-style:italic;font-weight:400;">Natural</span></h1>
      </div>

      <div style="padding:32px;">
        <h2 style="font-size:18px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">¡Tu pedido va en camino, ${customerName}! 🚚</h2>
        <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 24px;">Tu pedido ha sido despachado. Usa el número de seguimiento para rastrearlo:</p>

        <div style="background:#f0faf0;border:2px solid #2d6a30;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
          <p style="font-size:12px;color:#666;margin:0 0 4px;">Número de seguimiento</p>
          <p style="font-size:20px;font-weight:700;color:#1a3c2a;letter-spacing:0.05em;margin:0;">${trackingNumber}</p>
        </div>

        <div style="background:#f9faf8;border:1px solid #e8e8e0;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Transportadora</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0 0 10px;">${carrier}</p>
          <p style="font-size:12px;color:#888;text-transform:uppercase;margin:0 0 2px;">Destino</p>
          <p style="font-size:14px;color:#333;font-weight:500;margin:0;">${order.shipping_city || ''}, ${order.shipping_department || ''}</p>
        </div>

        ${trackUrl && trackUrl !== '#' ? `
        <div style="text-align:center;margin:24px 0;">
          <a href="${trackUrl}" style="display:inline-block;background:#1a3c2a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Rastrear mi pedido</a>
        </div>` : ''}

        <p style="font-size:14px;color:#555;line-height:1.6;">Si tienes alguna pregunta, responde a este email o escríbenos por WhatsApp.</p>
      </div>

      <div style="padding:24px 32px;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee;">
        <p style="margin:0;">Fortuna Natural — Productos naturales para tu bienestar</p>
<a href="https://fortunanatural.com" style="color:#1a3c2a;">fortunanatural.com</a>
      </div>
    </div>
  </body></html>`

  return {
    to: order.customer_email,
    subject: `🚚 Tu pedido va en camino — Tracking: ${trackingNumber}`,
    html
  }
}