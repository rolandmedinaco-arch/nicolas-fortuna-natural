<template>
  <div class="confirmation-page">
    <header class="confirmation-header">
      <router-link to="/" class="confirmation-logo">
        <span class="confirmation-logo-icon">🌿</span>
        <div class="confirmation-logo-text">
          <span class="logo-brand">Fortuna</span>
          <span class="logo-accent">Natural</span>
        </div>
      </router-link>
    </header>

    <div class="confirmation-content">
      <div class="confirmation-card">
        <div class="confirmation-icon">{{ statusConfig.icon }}</div>
        <h1 :style="{ color: statusConfig.color }">{{ statusConfig.title }}</h1>
        <p class="confirmation-subtitle">
          {{ statusConfig.subtitle }}
        </p>

        <div class="confirmation-details" v-if="refPayco || transactionId">
          <div class="detail-row" v-if="refPayco">
            <span class="detail-label">Referencia ePayco</span>
            <span class="detail-value">{{ refPayco }}</span>
          </div>
          <div class="detail-row" v-if="transactionId">
            <span class="detail-label">ID Transacción</span>
            <span class="detail-value">{{ transactionId }}</span>
          </div>
          <div class="detail-row" v-if="paymentStatus !== 'pending'">
            <span class="detail-label">Estado</span>
            <span class="detail-value" :style="{ color: statusConfig.color }">
              {{ statusConfig.statusLabel }}
            </span>
          </div>
        </div>

        <div class="confirmation-info">
          <!-- Aprobado -->
          <template v-if="paymentStatus === 'approved'">
            <div class="info-item">
              <span class="info-icon">📧</span>
              <div>
                <strong>Confirmación por correo</strong>
                <p>Recibirás un email con los detalles de tu pedido.</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📦</span>
              <div>
                <strong>Envío</strong>
                <p>Te notificaremos cuando tu pedido sea despachado.</p>
              </div>
            </div>
          </template>

          <!-- Pendiente -->
          <template v-else-if="paymentStatus === 'pending'">
            <div class="info-item">
              <span class="info-icon">⏳</span>
              <div>
                <strong>Verificación en proceso</strong>
                <p>Tu pago está siendo verificado. Esto puede tomar unos minutos.</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📧</span>
              <div>
                <strong>Te avisamos por correo</strong>
                <p>Recibirás un email cuando el pago sea confirmado.</p>
              </div>
            </div>
          </template>

          <!-- Rechazado o fallido -->
          <template v-else>
            <div class="info-item">
              <span class="info-icon">💳</span>
              <div>
                <strong>Intenta de nuevo</strong>
                <p>Puedes volver a la tienda y realizar el pago con otro método.</p>
              </div>
            </div>
          </template>

          <!-- Siempre visible -->
          <div class="info-item">
            <span class="info-icon">💬</span>
            <div>
              <strong>¿Preguntas?</strong>
              <p>Escríbenos por WhatsApp para cualquier consulta.</p>
            </div>
          </div>
        </div>

        <div class="confirmation-actions">
          <router-link to="/" class="btn-back">
            ← Volver a la tienda
          </router-link>
          <a
            :href="whatsappUrl"
            target="_blank"
            class="btn-whatsapp"
          >
            💬 Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '../data/site.js'
import { useCart } from '../composables/useCart.js'

const route = useRoute()
const { clearCart } = useCart()

const refPayco = ref('')
const transactionId = ref('')
const paymentStatus = ref('pending') // 'approved' | 'rejected' | 'pending' | 'failed'

const statusConfig = computed(() => {
  const configs = {
    approved: {
      icon: '✅',
      title: '¡Gracias por tu compra!',
      subtitle: 'Tu pago fue aprobado y tu pedido está siendo procesado.',
      statusLabel: 'Aprobado',
      color: '#166534'
    },
    pending: {
      icon: '⏳',
      title: 'Pago pendiente',
      subtitle: 'Tu transacción está en proceso de verificación. Te notificaremos por correo cuando sea confirmada.',
      statusLabel: 'Pendiente',
      color: '#92400e'
    },
    rejected: {
      icon: '❌',
      title: 'Pago rechazado',
      subtitle: 'Tu transacción no fue aprobada. Intenta con otro método de pago o contacta a tu banco.',
      statusLabel: 'Rechazado',
      color: '#991b1b'
    },
    failed: {
      icon: '⚠️',
      title: 'Error en el pago',
      subtitle: 'Ocurrió un error durante la transacción. Tu dinero no fue cobrado. Puedes intentar nuevamente.',
      statusLabel: 'Fallido',
      color: '#991b1b'
    }
  }
  return configs[paymentStatus.value] || configs.pending
})

const whatsappUrl = (() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  const msg = encodeURIComponent('Hola! Acabo de realizar una compra en Fortuna Natural y tengo una consulta.')
  return `https://wa.me/${num}?text=${msg}`
})()

onMounted(() => {
  const q = route.query

  // Capturar referencias de ePayco
  if (q.ref_payco) refPayco.value = q.ref_payco
  if (q.x_transaction_id) transactionId.value = q.x_transaction_id

  // ePayco x_cod_response: 1 = Aceptada, 2 = Rechazada, 3 = Pendiente, 4 = Fallida
  const codResponse = q.x_cod_response || q.x_cod_transaction_state
  if (codResponse === '1') {
    paymentStatus.value = 'approved'
    clearCart()
  } else if (codResponse === '2') {
    paymentStatus.value = 'rejected'
  } else if (codResponse === '3') {
    paymentStatus.value = 'pending'
  } else if (codResponse === '4') {
    paymentStatus.value = 'failed'
  } else if (q.x_response) {
    // Fallback: detectar por texto de respuesta
    const resp = q.x_response.toLowerCase()
    if (resp.includes('aceptada') || resp.includes('aprobada')) {
      paymentStatus.value = 'approved'
      clearCart()
    } else if (resp.includes('rechazada')) {
      paymentStatus.value = 'rejected'
    } else if (resp.includes('pendiente')) {
      paymentStatus.value = 'pending'
    } else {
      paymentStatus.value = 'failed'
    }
  }
  // Si no hay parámetros de ePayco, se queda en 'pending' por defecto
})
</script>

<style scoped>
.confirmation-page {
  min-height: 100vh;
  background: #f9fafb;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
}

.confirmation-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
}

.confirmation-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-primary, #1a3c2a);
}

.confirmation-logo-icon {
  font-size: 1.5rem;
}

.confirmation-logo-text {
  display: flex;
  flex-direction: column;
}

.logo-brand {
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary, #1a3c2a);
}

.logo-accent {
  font-style: italic;
  font-weight: 400;
  color: var(--color-accent, #c0922c);
  font-size: 0.8rem;
}

.confirmation-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1.5rem;
}

.confirmation-card {
  background: #fff;
  border-radius: 16px;
  padding: 3rem;
  max-width: 560px;
  width: 100%;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.confirmation-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.confirmation-card h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.confirmation-subtitle {
  font-size: 1.0625rem;
  color: #666;
  margin-bottom: 2rem;
}

.confirmation-details {
  background: #f5f7f5;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: #666;
}

.detail-value {
  font-weight: 700;
  color: #1a3c2a;
  font-size: 0.9375rem;
}

.confirmation-info {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-item strong {
  display: block;
  font-size: 0.9375rem;
  color: #333;
  margin-bottom: 0.125rem;
}

.info-item p {
  font-size: 0.8125rem;
  color: #888;
  margin: 0;
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary, #1a3c2a);
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #143021;
}

.btn-whatsapp {
  padding: 0.75rem 1.5rem;
  background: #25d366;
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: background 0.2s;
}

.btn-whatsapp:hover {
  background: #1da851;
}

@media (max-width: 480px) {
  .confirmation-card {
    padding: 2rem 1.5rem;
  }

  .confirmation-card h1 {
    font-size: 1.375rem;
  }

  .confirmation-actions {
    flex-direction: column;
  }

  .btn-back, .btn-whatsapp {
    text-align: center;
  }
}
</style>