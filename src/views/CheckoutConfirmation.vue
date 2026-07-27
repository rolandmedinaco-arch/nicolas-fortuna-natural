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
        <div class="confirmation-icon">✅</div>
        <h1>¡Gracias por tu compra!</h1>
        <p class="confirmation-subtitle">
          Tu pedido ha sido recibido y está siendo procesado.
        </p>

        <div class="confirmation-details" v-if="refPayco">
          <div class="detail-row">
            <span class="detail-label">Referencia ePayco</span>
            <span class="detail-value">{{ refPayco }}</span>
          </div>
        </div>

        <div class="confirmation-info">
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '../data/site.js'
import { useCart } from '../composables/useCart.js'

const route = useRoute()
const { clearCart } = useCart()

const refPayco = ref('')

const whatsappUrl = (() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  const msg = encodeURIComponent('Hola! Acabo de realizar una compra en Fortuna Natural y tengo una consulta.')
  return `https://wa.me/${num}?text=${msg}`
})()

onMounted(() => {
  // ePayco sends ref_payco as query param
  if (route.query.ref_payco) {
    refPayco.value = route.query.ref_payco
  }
  // Clear the cart after successful payment
  clearCart()
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
  color: #1a3c2a;
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