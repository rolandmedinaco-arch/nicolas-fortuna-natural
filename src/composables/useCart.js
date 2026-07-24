/**
 * useCart.js
 * Composable para manejar el carrito de compras
 * Ubicación: src/composables/useCart.js
 */
import { ref, computed } from 'vue'

const cartItems = ref([])
const isCartOpen = ref(false)

export function useCart() {
  // Agregar producto al carrito
  function addToCart(product) {
    const existing = cartItems.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        imagePlaceholder: product.imagePlaceholder,
        quantity: 1,
        woopinUrl: product.woopinUrl,
        whatsappMessage: product.whatsappMessage
      })
    }
    isCartOpen.value = true
  }

  // Eliminar producto del carrito
  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
  }

  // Cambiar cantidad
  function updateQuantity(productId, quantity) {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  // Vaciar carrito
  function clearCart() {
    cartItems.value = []
  }

  // Abrir/cerrar carrito
  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  function openCart() {
    isCartOpen.value = true
  }

  function closeCart() {
    isCartOpen.value = false
  }

  // Total de items
  const cartCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // Total de productos diferentes (para descuento)
  const uniqueProductCount = computed(() => {
    return cartItems.value.length
  })

  // Porcentaje de descuento según cantidad
  const discountPercent = computed(() => {
    const total = cartCount.value
    if (total >= 9) return 40
    if (total >= 2) return 20
    return 0
  })

  // Etiqueta del descuento
  const discountLabel = computed(() => {
    const total = cartCount.value
    if (total >= 9) return '🎉 Descuento Mayorista 40%'
    if (total >= 2) return '🔥 Descuento 20% por 2+ productos'
    return ''
  })

  // Subtotal sin descuento
  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  // Monto del descuento
  const discountAmount = computed(() => {
    return Math.round(subtotal.value * (discountPercent.value / 100))
  })

  // Total con descuento
  const total = computed(() => {
    return subtotal.value - discountAmount.value
  })

  // Generar mensaje de WhatsApp con el pedido
  const whatsappOrderMessage = computed(() => {
    if (cartItems.value.length === 0) return ''
    let msg = '¡Hola! Me interesa comprar:\n\n'
    cartItems.value.forEach(item => {
      msg += `• ${item.name} x${item.quantity} — $${item.price.toLocaleString('es-CO')} c/u\n`
    })
    msg += `\nSubtotal: $${subtotal.value.toLocaleString('es-CO')}`
    if (discountPercent.value > 0) {
      msg += `\nDescuento (${discountPercent.value}%): -$${discountAmount.value.toLocaleString('es-CO')}`
    }
    msg += `\nTotal: $${total.value.toLocaleString('es-CO')}`
    return encodeURIComponent(msg)
  })

  return {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    cartCount,
    uniqueProductCount,
    discountPercent,
    discountLabel,
    subtotal,
    discountAmount,
    total,
    whatsappOrderMessage
  }
}