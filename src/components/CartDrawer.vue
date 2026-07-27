<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="isCartOpen" class="cart-backdrop" @click="closeCart"></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="slide">
      <div v-if="isCartOpen" class="cart-drawer">
        <!-- Header -->
        <div class="cart-header">
          <h3>🛒 Mi Carrito <span v-if="cartCount > 0" class="cart-header-count">({{ cartCount }})</span></h3>
          <button class="cart-close" @click="closeCart">&times;</button>
        </div>

        <!-- Empty state -->
        <div v-if="cartItems.length === 0" class="cart-empty">
          <div class="cart-empty-icon">🛍️</div>
          <p>Tu carrito está vacío</p>
          <button class="btn btn-primary" @click="closeCart">Ver Productos</button>
        </div>

        <!-- Items -->
        <div v-else class="cart-body">
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <img
                :src="item.image || item.imagePlaceholder"
                :alt="item.name"
                class="cart-item-img"
                @error="e => e.target.src = `https://placehold.co/80x80/2d7d46/ffffff?text=${item.name}`"
              />
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <span class="cart-item-price">{{ formatPrice(item.price) }}</span>
                <div class="cart-item-qty">
                  <button class="qty-btn" @click="updateQuantity(item.id, item.quantity - 1)">−</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
                </div>
              </div>
              <button class="cart-item-remove" @click="removeFromCart(item.id)" title="Eliminar">🗑️</button>
            </div>
          </div>

          <!-- Discount banner -->
          <div v-if="discountLabel" class="cart-discount">
            {{ discountLabel }}
          </div>
          <div v-else-if="cartCount === 1" class="cart-discount-hint">
            💡 Agrega 1 producto más y obtén 20% de descuento
          </div>

          <!-- Totals -->
          <div class="cart-totals">
            <div class="cart-total-row">
              <span>Subtotal</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div v-if="discountPercent > 0" class="cart-total-row cart-total-discount">
              <span>Descuento ({{ discountPercent }}%)</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            <div class="cart-total-row cart-total-final">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="cart-actions">
<router-link
  to="/checkout"
  class="btn btn-primary cart-btn-checkout"
  style="text-align: center; text-decoration: none;"
  @click="isCartOpen = false"
>
  💳 Ir al Checkout
</router-link>

<a
  :href="whatsappCheckoutUrl"
  target="_blank"
  class="cart-btn-whatsapp"
>
  💬 Consultar por WhatsApp
</a>
            <button class="btn btn-ghost cart-btn-clear" @click="clearCart">
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '../composables/useCart.js'
import { formatPrice } from '../data/products.js'
import { site } from '../data/site.js'

const {
  cartItems,
  isCartOpen,
  cartCount,
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  discountPercent,
  discountLabel,
  subtotal,
  discountAmount,
  total,
  whatsappOrderMessage
} = useCart()

const whatsappCheckoutUrl = computed(() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${whatsappOrderMessage.value}`
})
function payWithEpayco() {
  if (cartItems.value.length === 0) return

  const description = cartItems.value
    .map(item => `${item.name} x${item.quantity}`)
    .join(', ')

  const handler = window.ePayco.checkout.configure({
    key: '48d34913070460166b1fadb4157e1084',
    test: false
  })

  handler.open({
    name: 'Fortuna Natural',
    description: description,
    invoice: 'FN-' + Date.now(),
    currency: 'cop',
    amount: total.value.toString(),
    tax_base: '0',
    tax: '0',
    country: 'co',
    lang: 'es',
    external: 'false',
    response: 'https://dev.nicogil.com/',
    confirmation: '',
    email_billing: '',
    methodsDisable: []
  })
}
</script>

<style scoped>
.cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e8e8e8;
  background: #f9f9f6;
}

.cart-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #1a1a1a;
}

.cart-header-count {
  color: #2d7d46;
  font-weight: 700;
}

.cart-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0 0.25rem;
}

.cart-close:hover {
  color: #1a1a1a;
}

/* Empty state */
.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.cart-empty-icon {
  font-size: 3rem;
}

.cart-empty .btn {
  margin-top: 0.5rem;
}

/* Body */
.cart-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Items */
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-info h4 {
  margin: 0 0 0.2rem;
  font-size: 0.9rem;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-price {
  font-size: 0.85rem;
  color: #2d7d46;
  font-weight: 600;
}

.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f9f9f6;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.2s;
}

.qty-btn:hover {
  border-color: #2d7d46;
  color: #2d7d46;
}

.qty-value {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.cart-item-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  opacity: 0.5;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.cart-item-remove:hover {
  opacity: 1;
}

/* Discount */
.cart-discount {
  margin: 0 1.5rem;
  padding: 0.6rem 1rem;
  background: #e8f5e9;
  color: #2d7d46;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.cart-discount-hint {
  margin: 0 1.5rem;
  padding: 0.6rem 1rem;
  background: #fff8e1;
  color: #8d6e00;
  border-radius: 8px;
  font-size: 0.82rem;
  text-align: center;
}

/* Totals */
.cart-totals {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e8e8e8;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.9rem;
  color: #555;
}

.cart-total-discount {
  color: #2d7d46;
}

.cart-total-final {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  padding-top: 0.5rem;
  border-top: 1px solid #e8e8e8;
  margin-top: 0.3rem;
}

/* Actions */
.cart-actions {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-btn-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem;
  background: #2d7d46;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: background 0.2s;
}

.cart-btn-checkout:hover {
  background: #24633a;
}

.cart-btn-clear {
  background: none;
  border: none;
  color: #999;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.4rem;
  text-align: center;
}

.cart-btn-clear:hover {
  color: #c62828;
}

.cart-btn-whatsapp {
  display: block;
  text-align: center;
  color: #2d7d46;
  font-size: 0.85rem;
  text-decoration: none;
  padding: 0.4rem;
}

.cart-btn-whatsapp:hover {
  text-decoration: underline;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .cart-drawer {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>