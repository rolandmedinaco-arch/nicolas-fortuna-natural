<template>
  <div class="product-card card" @click="$emit('open-detail', product)">
    <!-- Image -->
    <div class="product-img-wrap">
      <img
        :src="product.image || product.imagePlaceholder"
        :alt="product.name"
        class="product-img"
        loading="lazy"
        @error="e => e.target.src = `https://placehold.co/300x300/2d7d46/ffffff?text=${product.name}`"
      />
      <!-- Badge -->
      <div v-if="product.badge" class="product-badge">{{ product.badge }}</div>
      <!-- Hover overlay -->
      <div class="product-overlay">
        <button class="overlay-btn">👁 Ver Detalle</button>
      </div>
    </div>

    <!-- Content -->
    <div class="product-content">
      <span class="product-category">{{ product.category }}</span>
      <h4 class="product-name">{{ product.name }}</h4>
      <p class="product-tagline">{{ product.tagline }}</p>

      <!-- Stars -->
      <div class="stars" style="margin: var(--space-2) 0">
        <span v-for="i in 5" :key="i" class="star">★</span>
      </div>

      <!-- Price -->
      <div class="product-price-row">
        <span class="price-current">{{ formatPrice(product.price) }}</span>
        <span class="price-original">{{ formatPrice(product.originalPrice) }}</span>
      </div>

      <!-- Actions -->
      <div class="product-actions" @click.stop>
        <a :href="product.woopinUrl" target="_blank" class="btn btn-primary" style="flex:1">
          🛒 Comprar
        </a>
        <a :href="waUrl" target="_blank" class="btn btn-ghost" style="padding: var(--space-3)">
          💬
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '../data/products.js'
import { site } from '../data/site.js'

const props = defineProps({
  product: { type: Object, required: true },
})
defineEmits(['open-detail'])

const waUrl = computed(() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(props.product.whatsappMessage)}`
})
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-slow);
  display: flex;
  flex-direction: column;
}
.product-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-xl); }

/* Image */
.product-img-wrap {
  position: relative;
  overflow: hidden;
  background: var(--color-primary-pale);
  aspect-ratio: 1;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--space-6);
  transition: transform var(--transition-slow);
}
.product-card:hover .product-img { transform: scale(1.05); }

.product-badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  background: var(--color-accent);
  color: var(--color-dark);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 26, 18, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}
.product-card:hover .product-overlay { opacity: 1; }
.overlay-btn {
  background: white;
  color: var(--color-dark);
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  transform: translateY(8px);
  transition: transform var(--transition-base);
}
.product-card:hover .overlay-btn { transform: translateY(0); }

/* Content */
.product-content {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}
.product-category {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.product-name {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-dark);
  font-family: var(--font-heading);
}
.product-tagline {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.4;
  margin-bottom: var(--space-2);
}
.product-price-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.product-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: auto;
}
</style>
