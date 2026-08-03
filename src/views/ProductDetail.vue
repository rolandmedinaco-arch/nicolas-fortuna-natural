<template>
  <div v-if="product" class="product-detail">
    <!-- Breadcrumb -->
    <div class="container">
      <nav class="breadcrumb">
        <router-link to="/">Inicio</router-link>
        <span class="breadcrumb-sep">›</span>
        <router-link to="/#productos">Productos</router-link>
        <span class="breadcrumb-sep">›</span>
        <span>{{ product.name }}</span>
      </nav>
    </div>

    <!-- Main product section -->
    <section class="product-hero">
      <div class="container">
        <div class="product-grid">
          <!-- Image -->
          <div class="product-image-section">
            <div class="product-badge-detail" v-if="product.badge">{{ product.badge }}</div>
            <img
              :src="product.image || product.imagePlaceholder"
              :alt="product.name"
              class="product-main-image"
              @error="e => e.target.src = `https://placehold.co/500x500/2d7d46/ffffff?text=${product.name}`"
            />
          </div>

          <!-- Info -->
          <div class="product-info-section">
            <span class="product-category-label">{{ product.category }}</span>
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-tagline">{{ product.tagline }}</p>

            <!-- Stars -->
            <div class="product-rating">
              <span v-for="i in 5" :key="i" class="star">★</span>
              <span class="rating-text">4.9 · Miles de clientes satisfechos</span>
            </div>

            <!-- Price -->
            <div class="product-pricing">
              <span class="price-current">{{ formatPrice(product.price) }}</span>
              <span class="price-original" v-if="product.originalPrice">{{ formatPrice(product.originalPrice) }}</span>
              <span class="price-save" v-if="product.originalPrice">
                Ahorra {{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
              </span>
            </div>

            <!-- Short description -->
            <p class="product-short-desc">{{ product.shortDescription }}</p>

            <!-- Quantity + Add to cart -->
            <div class="product-buy-section">
              <div class="quantity-selector">
                <button @click="decreaseQty" class="qty-btn-detail">−</button>
                <span class="qty-display">{{ quantity }}</span>
                <button @click="increaseQty" class="qty-btn-detail">+</button>
              </div>
              <button @click="handleAddToCart" class="btn-add-to-cart">
                🛒 Agregar al Carrito
              </button>
            </div>

            <!-- WhatsApp -->
            <a :href="waUrl" target="_blank" class="btn-whatsapp-detail">
              💬 Consultar por WhatsApp
            </a>

            <!-- Trust badges -->
            <div class="trust-badges">
              <div class="trust-badge">🚚 Envío Nacional</div>
              <div class="trust-badge">✅ Garantía de Calidad</div>
              <div class="trust-badge">🔒 Pago Seguro</div>
              <div class="trust-badge">🌿 100% Natural</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Details tabs -->
    <section class="product-details-section">
      <div class="container">
        <!-- Tabs -->
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab: Description -->
        <div v-if="activeTab === 'description'" class="tab-content">
          <p class="full-description">{{ product.fullDescription }}</p>
          <div class="usage-info" v-if="product.useCases && product.useCases.length">
            <h3>Indicado para</h3>
            <div class="use-cases">
              <span v-for="uc in product.useCases" :key="uc" class="use-case-tag">{{ uc }}</span>
            </div>
          </div>
        </div>

        <!-- Tab: Benefits -->
        <div v-if="activeTab === 'benefits'" class="tab-content">
          <div class="benefits-grid">
            <div v-for="(benefit, i) in product.benefits" :key="i" class="benefit-item">
              <span class="benefit-icon">✅</span>
              <span>{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Tab: Ingredients -->
        <div v-if="activeTab === 'ingredients'" class="tab-content">
          <div class="ingredients-list">
            <span v-for="ing in product.ingredients" :key="ing" class="ingredient-tag">{{ ing }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Related products -->
    <section class="related-section" v-if="relatedProducts.length">
      <div class="container">
        <h2 class="related-title">También te puede interesar</h2>
        <div class="related-grid">
          <router-link
            v-for="rp in relatedProducts"
            :key="rp.id"
            :to="`/producto/${rp.slug}`"
            class="related-card"
          >
            <img
              :src="rp.image || rp.imagePlaceholder"
              :alt="rp.name"
              class="related-img"
              @error="e => e.target.src = `https://placehold.co/200x200/2d7d46/ffffff?text=${rp.name}`"
            />
            <h4>{{ rp.name }}</h4>
            <span class="related-price">{{ formatPrice(rp.price) }}</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <!-- Product not found -->
  <div v-else class="product-not-found">
    <div class="container" style="text-align: center; padding: 4rem 1rem;">
      <h2>Producto no encontrado</h2>
      <p>El producto que buscas no existe.</p>
      <router-link to="/" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
        Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { products, formatPrice } from '../data/products.js'
import { site } from '../data/site.js'
import { useCart } from '../composables/useCart.js'

const route = useRoute()
const { addToCart } = useCart()

const quantity = ref(1)
const activeTab = ref('description')

const product = computed(() => {
  return products.find(p => p.slug === route.params.slug)
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return products
    .filter(p => p.id !== product.value.id && p.category === product.value.category)
    .slice(0, 3)
    .concat(
      products
        .filter(p => p.id !== product.value.id && p.category !== product.value.category)
        .slice(0, 3 - products.filter(p => p.id !== product.value.id && p.category === product.value.category).length)
    )
    .slice(0, 3)
})

const tabs = computed(() => {
  const t = [{ id: 'description', label: 'Descripción' }]
  if (product.value?.benefits?.length) t.push({ id: 'benefits', label: 'Beneficios' })
  if (product.value?.ingredients?.length) t.push({ id: 'ingredients', label: 'Ingredientes' })
  return t
})

const waUrl = computed(() => {
  if (!product.value) return '#'
  const num = site.contact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(product.value.whatsappMessage || `Hola! Me interesa el producto ${product.value.name}`)}`
})

function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

function handleAddToCart() {
  for (let i = 0; i < quantity.value; i++) {
    addToCart(product.value)
  }
  quantity.value = 1
}

// Reset state when changing product
watch(() => route.params.slug, () => {
  quantity.value = 1
  activeTab.value = 'description'
  updateSchema()
  updateMetaTags()
})

// Schema.org JSON-LD para SEO
function updateSchema() {
  if (!product.value) return
  
  const oldSchema = document.querySelector('#product-schema')
  if (oldSchema) oldSchema.remove()
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.value.name,
    "description": product.value.shortDescription,
    "image": `https://fortunanatural.com${product.value.image}`,
    "brand": {
      "@type": "Brand",
      "name": "Fortuna Natural"
    },
    "offers": {
      "@type": "Offer",
      "price": product.value.price,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "url": `https://fortunanatural.com/producto/${product.value.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "Fortuna Natural"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    }
  }
  
  const script = document.createElement('script')
  script.id = 'product-schema'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}

// Meta tags dinámicos por producto
function updateMetaTags() {
  if (!product.value) return
  
  document.title = `${product.value.name} — ${product.value.tagline} | Fortuna Natural`
  
  const updates = {
    'meta[name="description"]': product.value.shortDescription,
    'meta[property="og:title"]': `${product.value.name} — ${product.value.tagline} | Fortuna Natural`,
    'meta[property="og:description"]': product.value.shortDescription,
    'meta[property="og:image"]': `https://fortunanatural.com${product.value.image}`,
    'meta[property="og:url"]': `https://fortunanatural.com/producto/${product.value.slug}`,
    'meta[name="twitter:title"]': `${product.value.name} — ${product.value.tagline}`,
    'meta[name="twitter:description"]': product.value.shortDescription,
    'meta[name="twitter:image"]': `https://fortunanatural.com${product.value.image}`,
    'link[rel="canonical"]': null
  }
  
  for (const [selector, content] of Object.entries(updates)) {
    const el = document.querySelector(selector)
    if (el) {
      if (selector.startsWith('link')) {
        el.setAttribute('href', `https://fortunanatural.com/producto/${product.value.slug}`)
      } else {
        el.setAttribute('content', content)
      }
    }
  }
}

onMounted(() => {
  updateSchema()
  updateMetaTags()
})

</script>

<style scoped>
.product-detail {
  padding-top: 80px;
}

/* Breadcrumb */
.breadcrumb {
  padding: 1rem 0;
  font-size: 0.85rem;
  color: #888;
}
.breadcrumb a {
  color: #2d7d46;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
.breadcrumb-sep {
  margin: 0 0.5rem;
  color: #ccc;
}

/* Hero grid */
.product-hero {
  padding: 1rem 0 3rem;
}
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Image */
.product-image-section {
  position: relative;
  background: #f5f5f0;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-main-image {
  max-width: 100%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 8px;
}
.product-badge-detail {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #2d7d46;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Info */
.product-category-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2d7d46;
  font-weight: 600;
}
.product-title {
  font-size: 2.2rem;
  margin: 0.3rem 0;
  color: #1a1a1a;
}
.product-tagline {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
}
.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.star {
  color: #f5a623;
  font-size: 1.1rem;
}
.rating-text {
  font-size: 0.85rem;
  color: #888;
}

/* Pricing */
.product-pricing {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
.price-current {
  font-size: 2rem;
  font-weight: 700;
  color: #2d7d46;
}
.price-original {
  font-size: 1.1rem;
  color: #999;
  text-decoration: line-through;
}
.price-save {
  font-size: 0.85rem;
  background: #fff3e0;
  color: #e65100;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
}

.product-short-desc {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* Buy section */
.product-buy-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}
.qty-btn-detail {
  width: 40px;
  height: 44px;
  border: none;
  background: #f5f5f0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.qty-btn-detail:hover {
  background: #e8e8e0;
}
.qty-display {
  width: 45px;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 600;
}
.btn-add-to-cart {
  flex: 1;
  padding: 0.85rem 1.5rem;
  background: #2d7d46;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-add-to-cart:hover {
  background: #24633a;
}

.btn-whatsapp-detail {
  display: block;
  text-align: center;
  padding: 0.6rem;
  color: #2d7d46;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.btn-whatsapp-detail:hover {
  text-decoration: underline;
}

/* Trust badges */
.trust-badges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.trust-badge {
  font-size: 0.82rem;
  color: #555;
  padding: 0.5rem;
  background: #f9f9f6;
  border-radius: 8px;
  text-align: center;
}

/* Details tabs */
.product-details-section {
  padding: 2rem 0 3rem;
  background: #f9f9f6;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e8e8e8;
  padding-bottom: 0;
}
.tab-btn {
  padding: 0.7rem 1.5rem;
  border: none;
  background: none;
  font-size: 0.95rem;
  cursor: pointer;
  color: #888;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}
.tab-btn.active {
  color: #2d7d46;
  border-bottom-color: #2d7d46;
  font-weight: 600;
}
.tab-content {
  padding: 1rem 0;
}
.full-description {
  color: #555;
  line-height: 1.8;
  max-width: 700px;
}

/* Benefits */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}
.benefit-item {
  display: flex;
  align-items: start;
  gap: 0.5rem;
  padding: 0.8rem;
  background: white;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #444;
}
.benefit-icon {
  flex-shrink: 0;
}

/* Ingredients */
.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.ingredient-tag {
  padding: 0.4rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #555;
}

/* Use cases */
.usage-info {
  margin-top: 1.5rem;
}
.usage-info h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.8rem;
}
.use-cases {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.use-case-tag {
  padding: 0.3rem 0.8rem;
  background: #e8f5e9;
  color: #2d7d46;
  border-radius: 15px;
  font-size: 0.82rem;
}

/* Related */
.related-section {
  padding: 3rem 0;
}
.related-title {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.related-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: #333;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.related-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.related-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 0.8rem;
}
.related-card h4 {
  margin: 0 0 0.3rem;
  font-size: 1rem;
}
.related-price {
  color: #2d7d46;
  font-weight: 600;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Not found */
.product-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .product-title {
    font-size: 1.6rem;
  }
  .price-current {
    font-size: 1.6rem;
  }
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .trust-badges {
    grid-template-columns: 1fr 1fr;
  }
}
</style>