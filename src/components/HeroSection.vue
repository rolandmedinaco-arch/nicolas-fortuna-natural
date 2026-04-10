<template>
  <section id="home" class="hero">
    <!-- Background gradient orbs -->
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>

    <div class="container hero-inner">
      <!-- Text content -->
      <div class="hero-content">
        <div class="hero-badge animate-fade-up">
          <span>⭐</span> Producto Más Vendido
        </div>

        <h1 class="hero-title animate-fade-up delay-1">
          Protege y
          <span class="hero-title-accent">Renueva</span>
          <br>Tus Ojos
        </h1>

        <p class="hero-subtitle animate-fade-up delay-2">
          <strong>Esplendor</strong> — fórmula exclusiva de extractos naturales que hidratan,
          refrescan y relajan el globo ocular. Nutre con Luteína y Zeaxantina para
          una visión brillante y saludable.
        </p>

        <!-- Key benefits pills -->
        <div class="hero-benefits animate-fade-up delay-3">
          <span v-for="b in heroBenefits" :key="b" class="benefit-pill">
            ✓ {{ b }}
          </span>
        </div>

        <!-- Price -->
        <div class="hero-price animate-fade-up delay-4">
          <span class="price-current">{{ formattedPrice }}</span>
          <span class="price-original">{{ formattedOriginal }}</span>
          <span class="price-discount">Ahorra {{ savings }}</span>
        </div>

        <!-- CTAs -->
        <div class="hero-ctas animate-fade-up delay-5">
          <a :href="product.woopinUrl" target="_blank" class="btn btn-accent btn-lg">
            🛒 Comprar Ahora
          </a>
          <a :href="whatsappUrl" target="_blank" class="btn btn-outline btn-lg hero-wa-btn">
            💬 Consultar
          </a>
        </div>

        <!-- Trust badges -->
        <div class="hero-trust animate-fade-up delay-5">
          <div v-for="trust in trustItems" :key="trust.label" class="trust-item">
            <span class="trust-icon">{{ trust.icon }}</span>
            <span>{{ trust.label }}</span>
          </div>
        </div>
      </div>

      <!-- Product image -->
      <div class="hero-image animate-fade-right">
        <div class="hero-img-wrapper">
          <div class="hero-img-glow"></div>
          <img
            :src="product.image || product.imagePlaceholder"
            :alt="product.name"
            class="hero-img"
            @error="onImgError"
          />
          <!-- Floating label -->
          <div class="hero-float-card">
            <div class="float-card-inner">
              <span class="float-card-num">6,548+</span>
              <span class="float-card-text">Clientes satisfechos</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="hero-scroll-indicator" @click="scrollToSection">
      <span>Descubre más</span>
      <div class="scroll-arrow">↓</div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getHeroProduct, formatPrice } from '../data/products.js'
import { site } from '../data/site.js'

const product = getHeroProduct()

const formattedPrice = computed(() => formatPrice(product.price))
const formattedOriginal = computed(() => formatPrice(product.originalPrice))
const savings = computed(() => {
  const diff = product.originalPrice - product.price
  const pct = Math.round((diff / product.originalPrice) * 100)
  return `${pct}%`
})

const heroBenefits = [
  'Sin Cirugía',
  '100% Natural',
  'Resultados Visibles',
]

const trustItems = [
  { icon: '🚚', label: 'Envío Nacional' },
  { icon: '✅', label: 'Garantía de calidad' },
  { icon: '💳', label: 'Pago Seguro' },
  { icon: '🌿', label: 'Ingredientes Naturales' },
]

const whatsappUrl = computed(() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  const msg = encodeURIComponent(product.whatsappMessage)
  return `https://wa.me/${num}?text=${msg}`
})

function scrollToSection() {
  document.getElementById('esplendor')?.scrollIntoView({ behavior: 'smooth' })
}

function onImgError(e) {
  e.target.src = 'https://placehold.co/500x500/2d7d46/ffffff?text=Esplendor'
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-dark) 0%, var(--color-dark-2) 40%, var(--color-dark-3) 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-top: 80px;
}

/* Orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
  animation: float 7s ease-in-out infinite;
}
.hero-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, var(--color-primary), transparent);
  top: -100px; right: -100px;
  animation-delay: 0s;
}
.hero-orb-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, var(--color-accent), transparent);
  bottom: -50px; left: -50px;
  animation-delay: 2.5s;
}
.hero-orb-3 {
  width: 250px; height: 250px;
  background: radial-gradient(circle, var(--color-primary-light), transparent);
  top: 50%; left: 35%;
  animation-delay: 4s;
  opacity: 0.2;
}

/* Layout */
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-16);
  padding-top: var(--space-16);
  padding-bottom: var(--space-16);
}

/* Content */
.hero-content { z-index: 2; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(200, 162, 39, 0.2);
  border: 1px solid rgba(200, 162, 39, 0.4);
  color: var(--color-accent-light);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-6);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: var(--text-6xl);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  margin-bottom: var(--space-6);
}
.hero-title-accent {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin-bottom: var(--space-8);
  max-width: 520px;
}
.hero-subtitle strong { color: var(--color-accent-light); }

/* Benefits */
.hero-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}
.benefit-pill {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  backdrop-filter: blur(4px);
}

/* Price */
.hero-price {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}
.hero-price .price-current { color: var(--color-accent-light); font-size: var(--text-4xl); }
.hero-price .price-original { color: rgba(255,255,255,0.4); }

/* CTAs */
.hero-ctas {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-10);
  flex-wrap: wrap;
}
.hero-wa-btn {
  border-color: rgba(255,255,255,0.4);
  color: white;
}
.hero-wa-btn:hover {
  background: rgba(255,255,255,0.15);
  color: white;
  border-color: white;
}

/* Trust */
.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}
.trust-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255,255,255,0.65);
  font-size: var(--text-sm);
}
.trust-icon { font-size: 1.1rem; }

/* Product Image */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.hero-img-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-img-glow {
  position: absolute;
  inset: -30px;
  background: radial-gradient(circle, rgba(45,125,70,0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}
.hero-img {
  width: min(420px, 90%);
  height: auto;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 20px 60px rgba(0,0,0,0.4));
  animation: float 5s ease-in-out infinite;
  animation-delay: 0.5s;
}

/* Float card */
.hero-float-card {
  position: absolute;
  bottom: 20px;
  right: -20px;
  background: white;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-5);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  animation: float 4s ease-in-out infinite;
  animation-delay: 1s;
}
.float-card-inner { text-align: center; }
.float-card-num {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 900;
  color: var(--color-primary);
}
.float-card-text {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Scroll indicator */
.hero-scroll-indicator {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255,255,255,0.5);
  font-size: var(--text-xs);
  cursor: pointer;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color var(--transition-fast);
}
.hero-scroll-indicator:hover { color: rgba(255,255,255,0.9); }
.scroll-arrow { animation: bounce 2s infinite; font-size: 1.2rem; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* Animation classes */
.animate-fade-up { animation: fade-up 0.7s ease both; }
.animate-fade-right { animation: fade-right 0.8s ease both; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-right {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Responsive */
@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-12);
  }
  .hero-content { order: 2; }
  .hero-image { order: 1; }
  .hero-benefits, .hero-ctas, .hero-trust { justify-content: center; }
  .hero-subtitle { margin: 0 auto var(--space-8); }
  .hero-float-card { right: 0; }
  .hero-img { width: min(300px, 80%); }
}
</style>
