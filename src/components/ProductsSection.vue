<template>
  <section id="productos" class="section products-section">
    <div class="container">
      <!-- Header -->
      <div class="section-header animate-on-scroll">
        <span class="section-label">Catálogo Completo</span>
        <h2 class="section-title">Nuestros <span>Productos</span></h2>
        <div class="divider"></div>
        <p class="section-desc">Cada producto está formulado con ingredientes naturales de la más alta calidad para transformar tu bienestar.</p>
      </div>

      <!-- Category filter -->
      <div class="category-filters animate-on-scroll">
        <button
          v-for="cat in filterOptions"
          :key="cat.value"
          class="filter-btn"
          :class="{ active: activeFilter === cat.value }"
          @click="activeFilter = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Products grid -->
      <TransitionGroup name="product-list" tag="div" class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          class="animate-on-scroll"
          @open-detail="openModal"
        />
      </TransitionGroup>
    </div>

    <!-- Product Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedProduct" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box product-modal">
          <button class="modal-close" @click="closeModal">✕</button>
          <div class="modal-inner">
            <!-- Image -->
            <div class="modal-img-col">
              <div class="modal-img-wrapper">
                <img
                  :src="selectedProduct.image || selectedProduct.imagePlaceholder"
                  :alt="selectedProduct.name"
                  class="modal-img"
                  @error="e => e.target.src = `https://placehold.co/400x400/2d7d46/ffffff?text=${selectedProduct.name}`"
                />
                <div v-if="selectedProduct.badge" class="modal-badge">{{ selectedProduct.badge }}</div>
              </div>
            </div>

            <!-- Info -->
            <div class="modal-info-col">
              <div class="modal-category">{{ selectedProduct.category }}</div>
              <h3 class="modal-title">{{ selectedProduct.name }}</h3>
              <p class="modal-tagline">{{ selectedProduct.tagline }}</p>

              <!-- Stars -->
              <div class="stars" style="margin-bottom: var(--space-4)">
                <span v-for="i in 5" :key="i" class="star">★</span>
              </div>

              <p class="modal-desc">{{ selectedProduct.fullDescription }}</p>

              <!-- Benefits -->
              <div v-if="selectedProduct.benefits.length" class="modal-benefits">
                <h5>✅ Beneficios</h5>
                <ul>
                  <li v-for="b in selectedProduct.benefits" :key="b">{{ b }}</li>
                </ul>
              </div>

              <!-- Price -->
              <div class="modal-price-row">
                <span class="price-current">{{ formatPrice(selectedProduct.price) }}</span>
                <span class="price-original">{{ formatPrice(selectedProduct.originalPrice) }}</span>
                <span class="price-discount">{{ discount(selectedProduct) }}% OFF</span>
              </div>

              <!-- CTAs -->
              <div class="modal-ctas">
<button @click="addToCart(selectedProduct); closeModal()" class="btn btn-accent btn-lg" style="flex:1">
            🛒 Agregar al Carrito
          </button>
                          <a :href="waUrl(selectedProduct)" target="_blank" class="btn btn-ghost">
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { products, CATEGORIES, formatPrice } from '../data/products.js'
import { site } from '../data/site.js'
import ProductCard from './ProductCard.vue'
import { useCart } from '../composables/useCart.js'
const { addToCart } = useCart()

const activeFilter = ref('all')
const selectedProduct = ref(null)

// Después — solo categorías con al menos 1 producto
const usedCategories = [...new Set(products.map(p => p.category))]
const filterOptions = [
  { value: 'all', label: '🌿 Todos' },
  ...usedCategories.map(c => ({ value: c, label: c })),
]

const filteredProducts = computed(() =>
  activeFilter.value === 'all'
    ? products
    : products.filter(p => p.category === activeFilter.value)
)

function openModal(product) { selectedProduct.value = product }
function closeModal() { selectedProduct.value = null }

function discount(p) {
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
}

function waUrl(p) {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(p.whatsappMessage)}`
}

// Close on Escape
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal() })
}
</script>

<style scoped>
.products-section { background: var(--color-bg); }

/* Filter */
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-12);
}
.filter-btn {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  background: white;
  border: 2px solid var(--color-border);
  transition: all var(--transition-base);
}
.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-8);
}

/* Transition group */
.product-list-enter-active, .product-list-leave-active {
  transition: all 0.4s ease;
}
.product-list-enter-from, .product-list-leave-to {
  opacity: 0; transform: scale(0.9);
}
.product-list-move { transition: transform 0.4s ease; }

/* Modal */
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box {
  transform: scale(0.95) translateY(20px);
}

.product-modal { max-width: 900px; }
.modal-inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
}

/* Modal image column */
.modal-img-col {
  background: var(--color-primary-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-10);
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
  position: relative;
}
.modal-img-wrapper { position: relative; }
.modal-img {
  width: 260px;
  height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 12px 30px rgba(45,125,70,0.25));
}
.modal-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--color-accent);
  color: var(--color-dark);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
}

/* Modal info column */
.modal-info-col {
  padding: var(--space-10) var(--space-8);
  overflow-y: auto;
  max-height: 90vh;
}
.modal-category {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}
.modal-title {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-2);
}
.modal-tagline {
  color: var(--color-text-muted);
  font-style: italic;
  margin-bottom: var(--space-4);
}
.modal-desc {
  font-size: var(--text-sm);
  line-height: 1.8;
  margin-bottom: var(--space-5);
  white-space: pre-line;
}
.modal-benefits { margin-bottom: var(--space-5); }
.modal-benefits h5 { font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); margin-bottom: var(--space-2); }
.modal-benefits ul { display: flex; flex-direction: column; gap: var(--space-1); }
.modal-benefits li {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  padding-left: var(--space-4);
  position: relative;
}
.modal-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 700;
}
.modal-price-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}
.modal-ctas {
  display: flex;
  gap: var(--space-3);
}

@media (max-width: 700px) {
  .modal-inner { grid-template-columns: 1fr; }
  .modal-img-col { border-radius: var(--radius-xl) var(--radius-xl) 0 0; padding: var(--space-8); }
  .modal-img { width: 180px; height: 200px; }
}
</style>
