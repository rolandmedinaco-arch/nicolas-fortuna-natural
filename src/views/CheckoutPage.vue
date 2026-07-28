<template>
  <div class="checkout-page">
    <!-- Header -->
    <header class="checkout-header">
<router-link to="/" class="checkout-logo">
        <span class="checkout-logo-icon">🌿</span>
        <div class="checkout-logo-text">
          <span class="logo-brand">Fortuna</span>
          <span class="logo-accent">Natural</span>
        </div>
      </router-link>
          </header>

    <!-- Empty cart redirect -->
    <div v-if="cartItems.length === 0" class="checkout-empty">
      <div class="checkout-empty-icon">🛒</div>
      <h2>Tu carrito está vacío</h2>
      <p>Agrega productos antes de continuar al checkout.</p>
      <router-link to="/" class="btn btn-primary">Ver Productos</router-link>
    </div>

    <!-- Checkout content -->
    <div v-else class="checkout-content">
      <!-- Left column: Form -->
      <div class="checkout-form-col">
        <!-- Contact -->
        <section class="checkout-section">
          <h2 class="checkout-section-title">Contacto</h2>
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              placeholder="300 123 4567"
              required
            />
          </div>
        </section>

        <!-- Shipping -->
        <section class="checkout-section">
          <h2 class="checkout-section-title">Entrega</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                v-model="form.firstName"
                placeholder="Nombre"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName">Apellidos</label>
              <input
                type="text"
                id="lastName"
                v-model="form.lastName"
                placeholder="Apellidos"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="cedula">Cédula / NIT</label>
            <input
              type="text"
              id="cedula"
              v-model="form.cedula"
              placeholder="Número de documento"
              required
            />
          </div>
          <div class="form-group">
            <label for="address">Dirección</label>
            <input
              type="text"
              id="address"
              v-model="form.address"
              placeholder="Calle, carrera, número"
              required
            />
          </div>
          <div class="form-group">
            <label for="addressExtra">Apartamento, casa, etc. (opcional)</label>
            <input
              type="text"
              id="addressExtra"
              v-model="form.addressExtra"
              placeholder="Apto, interior, torre..."
            />
          </div>
          <div class="form-row form-row-3">
<div class="form-group">
              <label for="department">Departamento</label>
              <select id="department" v-model="form.department" required>
                <option value="" disabled>Selecciona un departamento</option>
                <option v-for="dept in departments" :key="dept.code" :value="dept.code">{{ dept.name }}</option>
              </select>
            </div>
<div class="form-group">
              <label for="city">Ciudad</label>
              <select id="city" v-model="form.city" required :disabled="!form.department">
                <option value="" disabled>{{ form.department ? 'Selecciona una ciudad' : 'Primero selecciona departamento' }}</option>
                <option v-for="city in filteredCities" :key="city.dane" :value="city.name">{{ city.name }}</option>
              </select>
            </div>
                        <div class="form-group">
              <label for="postalCode">Código postal (op.)</label>
              <input
                type="text"
                id="postalCode"
                v-model="form.postalCode"
                placeholder="Código postal"
              />
            </div>
          </div>
        </section>

<!-- Shipping method -->
        <section class="checkout-section">
          <h2 class="checkout-section-title">Método de envío</h2>
          
          <div v-if="shippingLoading" class="shipping-loading">
            <span>🔄 Cotizando con transportadoras...</span>
          </div>

          <div v-else-if="shippingOptions.length > 0" class="shipping-options">
            <label 
              v-for="carrier in shippingOptions" 
              :key="carrier.carrier + carrier.service"
              class="shipping-option"
              :class="{ active: selectedCarrier && selectedCarrier.carrier === carrier.carrier && selectedCarrier.service === carrier.service }"
              @click="selectCarrier(carrier)"
            >
              <input 
                type="radio" 
                name="shipping" 
                :checked="selectedCarrier && selectedCarrier.carrier === carrier.carrier && selectedCarrier.service === carrier.service"
              />
              <div class="shipping-option-info">
                <span class="shipping-option-name">{{ carrier.carrier }}</span>
                <span class="shipping-option-time">{{ carrier.delivery_time }}</span>
              </div>
              <span class="shipping-option-price">{{ formatPrice(carrier.price) }}</span>
            </label>
          </div>

          <div v-else class="shipping-options">
            <label class="shipping-option active">
              <input type="radio" checked />
              <div class="shipping-option-info">
                <span class="shipping-option-name">Envío estándar</span>
                <span class="shipping-option-time">5-7 días hábiles</span>
              </div>
              <span class="shipping-option-price">{{ formatPrice(shippingCost) }}</span>
            </label>
          </div>

          <p v-if="shippingError" class="shipping-note">
            ⚠️ {{ shippingError }}
          </p>
          <p v-else-if="form.city && !shippingLoading && shippingOptions.length > 0" class="shipping-note shipping-note-success">
            ✅ {{ shippingOptions.length }} opciones de envío para {{ form.city }}
          </p>
          <p v-else-if="!form.city" class="shipping-note">
            💡 Selecciona departamento y ciudad para cotizar el envío.
          </p>
        </section>

        <!-- Submit -->
        <button
          class="btn-pay"
          @click="handlePay"
          :disabled="!isFormValid"
        >
          💳 Pagar {{ formatPrice(grandTotal) }}
        </button>

        <div class="checkout-footer-links">
          <router-link to="/">← Volver a la tienda</router-link>
          <a href="/terminos.html" target="_blank">Términos y Condiciones</a>
          <a href="/privacidad.html" target="_blank">Política de Privacidad</a>
        </div>
      </div>

      <!-- Right column: Order Summary -->
      <aside class="checkout-summary-col">
        <div class="checkout-summary">
          <h2 class="summary-title">Resumen del pedido</h2>

          <!-- Products -->
          <div class="summary-products">
            <div v-for="item in cartItems" :key="item.id" class="summary-product">
              <div class="summary-product-img-wrap">
                <img :src="item.image" :alt="item.name" class="summary-product-img" />
                <span class="summary-product-qty">{{ item.quantity }}</span>
              </div>
              <div class="summary-product-info">
                <span class="summary-product-name">{{ item.name }}</span>
              </div>
              <span class="summary-product-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <!-- Discount code -->
          <div class="summary-discount-row">
            <input
              type="text"
              v-model="discountCode"
              placeholder="Código de descuento"
              class="discount-input"
            />
            <button class="discount-btn" @click="applyDiscount">Aplicar</button>
          </div>

          <!-- Totals -->
          <div class="summary-totals">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div v-if="discountPercent > 0" class="summary-row summary-row-discount">
              <span>Descuento ({{ discountPercent }}%)</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            <div class="summary-row">
              <span>Envío</span>
              <span>{{ formatPrice(shippingCost) }}</span>
            </div>
            <div class="summary-row summary-row-total">
              <span>Total</span>
              <span class="summary-total-amount">
                <small>COP</small> {{ formatPrice(grandTotal) }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart.js'
import { formatPrice } from '../data/products.js'
import { site } from '../data/site.js'
import { departments, getCitiesForDepartment, getDaneCode } from '../data/colombianCities.js'
import { watch } from 'vue'

const router = useRouter()
const {
  cartItems,
  subtotal,
  discountPercent,
  discountAmount,
  total
} = useCart()

const discountCode = ref('')
const shippingCost = ref(15000) // $15.000 COP fijo por ahora
const shippingLoading = ref(false)
const shippingError = ref('')
const shippingOptions = ref([])
const selectedCarrier = ref(null)

// Ciudades filtradas según departamento seleccionado
const filteredCities = computed(() => {
  if (!form.value.department) return []
  return getCitiesForDepartment(form.value.department)
})

// Cuando cambia el departamento, resetear ciudad y envío
watch(() => form.value.department, () => {
  form.value.city = ''
  shippingCost.value = 15000
  shippingError.value = ''
})

// Cuando selecciona ciudad, cotizar envío
  watch(() => form.value.city, async (newCity) => {
    if (!newCity || !form.value.department) return

    const daneCode = getDaneCode(newCity, form.value.department)
    if (!daneCode) return

    shippingLoading.value = true
    shippingError.value = ''
    shippingOptions.value = []
    selectedCarrier.value = null

    try {
      const res = await fetch('/.netlify/functions/shipping-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_dane_code: daneCode,
          items: cartItems.value.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            weight: item.weight || 0.5,
            height: item.height || 10,
            width: item.width || 10,
            length: item.length || 10
          }))
        })
      })
      const data = await res.json()

      if (data.carriers && data.carriers.length > 0) {
        shippingOptions.value = data.carriers
        selectedCarrier.value = data.carriers[0]
        shippingCost.value = data.carriers[0].price
      } else {
        shippingCost.value = 15000
        shippingError.value = 'No se encontraron opciones de envío'
      }
    } catch (err) {
      console.error('Error cotizando envío:', err)
      shippingCost.value = 15000
      shippingError.value = 'Error al cotizar, tarifa estándar aplicada'
    } finally {
      shippingLoading.value = false
    }
  })

const form = ref({
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  cedula: '',
  address: '',
  addressExtra: '',
  department: '',
  city: '',
  postalCode: '',
  shippingMethod: 'standard'
})


const grandTotal = computed(() => total.value + shippingCost.value)

const isFormValid = computed(() => {
  const f = form.value
  return f.email && f.phone && f.firstName && f.lastName &&
         f.cedula && f.address && f.department && f.city
})

function selectCarrier(carrier) {
    selectedCarrier.value = carrier
    shippingCost.value = carrier.price
  }

function applyDiscount() {
  // Placeholder: validar código de descuento
  // Por ahora solo se aplican los descuentos automáticos del carrito
}

async function handlePay() {
    if (!isFormValid.value) return

    const description = cartItems.value
      .map(item => `${item.name} x${item.quantity}`)
      .join(', ')

    // 1. Guardar pedido en Supabase
    let orderId = null
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.value.email,
          phone: form.value.phone,
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          cedula: form.value.cedula,
          address: form.value.address,
          addressExtra: form.value.addressExtra,
          department: form.value.department,
          city: form.value.city,
          postalCode: form.value.postalCode,
          items: cartItems.value.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal: subtotal.value,
          discountPercent: discountPercent.value,
          discountAmount: discountAmount.value,
          shippingCost: shippingCost.value,
          total: grandTotal.value,
          shippingMethod: form.value.shippingMethod
        })
      })
      const data = await res.json()
      if (data.order_id) {
        orderId = data.order_id
      }
    } catch (err) {
      console.error('Error creando pedido:', err)
    }

    // 2. Abrir ePayco con el order_id
    const handler = window.ePayco.checkout.configure({
      key: '48d34913070460166b1fadb4157e1084',
      test: false
    })

    handler.open({
      name: 'Fortuna Natural',
      description: description,
      invoice: orderId || 'FN-' + Date.now(),
      currency: 'cop',
      amount: grandTotal.value.toString(),
      tax_base: '0',
      tax: '0',
      country: 'co',
      lang: 'es',
      external: 'false',
      response: window.location.origin + '/checkout/confirmacion',
      confirmation: window.location.origin + '/api/epayco-webhook',
      email_billing: form.value.email,
      name_billing: form.value.firstName + ' ' + form.value.lastName,
      address_billing: form.value.address,
      methodsDisable: [],
      extra1: orderId
    })
  }
  </script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #fff;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
}

/* Header */
.checkout-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
}
.shipping-loading {
  padding: 1.5rem;
  text-align: center;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

.checkout-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-primary, #1a3c2a);
}

.checkout-logo-icon {
  font-size: 1.5rem;
}

.logo-brand {
  font-weight: 700;
  display: block;
  line-height: 1.1;
}

.logo-accent {
  font-style: italic;
  font-weight: 400;
  color: var(--color-accent, #c0922c);
  font-size: 0.8rem;
}

.checkout-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary, #1a3c2a);
}

/* Empty cart */
.checkout-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1rem;
}

.checkout-empty-icon {
  font-size: 3rem;
}

.checkout-empty h2 {
  font-size: 1.5rem;
  color: #333;
}

.checkout-empty p {
  color: #666;
}

/* Layout */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 420px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 70px);
}

/* Form column */
.checkout-form-col {
  padding: 2rem 3rem 3rem;
  border-right: 1px solid #e5e5e5;
}

.checkout-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.checkout-section:last-of-type {
  border-bottom: none;
}

.checkout-section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

/* Form fields */
.form-group {
  margin-bottom: 0.875rem;
}

.form-group label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.375rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #333;
  background: #fff;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary, #1a3c2a);
  box-shadow: 0 0 0 2px rgba(26, 60, 42, 0.1);
}

.form-group input::placeholder {
  color: #aaa;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

.form-row-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

/* Shipping options */
.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shipping-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.shipping-option.active {
  border-color: var(--color-primary, #1a3c2a);
  background: rgba(26, 60, 42, 0.03);
}

.shipping-option input[type="radio"] {
  accent-color: var(--color-primary, #1a3c2a);
}

.shipping-option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.shipping-option-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: #333;
}

.shipping-option-time {
  font-size: 0.8125rem;
  color: #888;
}

.shipping-option-price {
  font-weight: 700;
  color: #333;
}

.shipping-note {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: #888;
}

/* Payment */
.payment-info {
  font-size: 0.9375rem;
  color: #555;
  margin-bottom: 1rem;
}

.payment-methods-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pm-badge {
  padding: 0.25rem 0.75rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
}

/* Pay button */
.btn-pay {
  display: block;
  width: 100%;
  padding: 1rem;
  background: var(--color-primary, #1a3c2a);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-bottom: 1.5rem;
  font-family: inherit;
}

.btn-pay:hover:not(:disabled) {
  background: var(--color-primary-dark, #143021);
  transform: translateY(-1px);
}

.btn-pay:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Footer links */
.checkout-footer-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8125rem;
}

.checkout-footer-links a {
  color: var(--color-primary, #1a3c2a);
  text-decoration: underline;
}

/* Summary column */
.checkout-summary-col {
  background: #fafafa;
  padding: 2rem;
}

.checkout-summary {
  position: sticky;
  top: 2rem;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

/* Products in summary */
.summary-products {
  margin-bottom: 1.5rem;
}

.summary-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.summary-product:last-child {
  border-bottom: none;
}

.summary-product-img-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.summary-product-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  background: #fff;
}

.summary-product-qty {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-primary, #1a3c2a);
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.6875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-product-info {
  flex: 1;
}

.summary-product-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.summary-product-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

/* Discount */
.summary-discount-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.discount-input {
  flex: 1;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
}

.discount-input:focus {
  outline: none;
  border-color: var(--color-primary, #1a3c2a);
}

.discount-btn {
  padding: 0.625rem 1.25rem;
  background: #f0f0f0;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.discount-btn:hover {
  background: #e5e5e5;
}

/* Totals */
.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
  color: #555;
}

.summary-row-discount {
  color: var(--color-accent, #c0922c);
}

.summary-row-total {
  padding-top: 0.75rem;
  border-top: 1px solid #ddd;
  font-weight: 700;
  font-size: 1.0625rem;
  color: #333;
}

.summary-total-amount small {
  font-size: 0.75rem;
  font-weight: 400;
  color: #888;
}

/* Responsive */
@media (max-width: 900px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .checkout-summary-col {
    order: -1;
    border-bottom: 1px solid #e5e5e5;
  }

  .checkout-summary {
    position: static;
  }

  .checkout-form-col {
    padding: 1.5rem;
    border-right: none;
  }

  .form-row-3 {
    grid-template-columns: 1fr 1fr;
  }

  .checkout-footer-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .checkout-form-col {
    padding: 1rem;
  }

  .checkout-summary-col {
    padding: 1rem;
  }

  .form-row,
  .form-row-3 {
    grid-template-columns: 1fr;
  }
}
</style>