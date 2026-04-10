<template>
  <!-- Esplendor detail / about section -->
  <section id="esplendor" class="section esplendor-section">
    <div class="container">
      <!-- Section header -->
      <div class="section-header animate-on-scroll">
        <span class="section-label">Producto Estrella</span>
        <h2 class="section-title">Esplendor — <span>La Luz de Tus Ojos</span></h2>
        <div class="divider"></div>
        <p class="section-desc">Una fórmula revolucionaria que combina la sabiduría de la naturaleza con la ciencia moderna para cuidar tu visión.</p>
      </div>

      <!-- Feature grid -->
      <div class="esplendor-grid">
        <!-- Left: Benefits -->
        <div class="esplendor-benefits animate-on-scroll from-left">
          <div v-for="(benefit, i) in product.benefits" :key="i" class="benefit-card" :style="{ transitionDelay: `${i * 0.08}s` }">
            <div class="benefit-icon">✓</div>
            <span>{{ benefit }}</span>
          </div>

          <!-- Ingredients -->
          <div class="ingredients-block">
            <h4>🌿 Ingredientes Activos</h4>
            <div class="ingredients-pills">
              <span v-for="ing in product.ingredients" :key="ing" class="ing-pill">{{ ing }}</span>
            </div>
          </div>
        </div>

        <!-- Center: Product image -->
        <div class="esplendor-img-wrapper animate-on-scroll">
          <div class="esplendor-img-bg"></div>
          <img
            :src="product.image || product.imagePlaceholder"
            :alt="product.name"
            class="esplendor-img"
            @error="e => e.target.src = 'https://placehold.co/400x480/2d7d46/ffffff?text=Esplendor'"
          />
          <!-- Stats overlay -->
          <div class="esplendor-stat esplendor-stat-top">
            <span class="stat-num">6,548+</span>
            <span class="stat-label">Vendidos</span>
          </div>
          <div class="esplendor-stat esplendor-stat-bottom">
            <span class="stat-num">⭐ 4.9</span>
            <span class="stat-label">Calificación</span>
          </div>
        </div>

        <!-- Right: Description + CTA -->
        <div class="esplendor-info animate-on-scroll from-right">
          <div class="info-badge">100% Natural · Sin Efectos Secundarios</div>
          <p class="info-desc">{{ product.fullDescription }}</p>

          <div class="info-price">
            <div>
              <div class="price-current">{{ formatPrice(product.price) }}</div>
              <div class="price-original">Antes: {{ formatPrice(product.originalPrice) }}</div>
            </div>
            <span class="price-discount">Ahorra {{ discount }}%</span>
          </div>

          <div class="info-ctas">
            <a :href="product.woopinUrl" target="_blank" class="btn btn-accent btn-lg">
              🛒 Comprar con Woopin
            </a>
            <a :href="whatsappUrl" target="_blank" class="btn btn-ghost">
              💬 Preguntar por WhatsApp
            </a>
          </div>

          <!-- How to use -->
          <div class="how-to-use">
            <h5>📋 Modo de Uso</h5>
            <p>Aplicar 2-3 gotas en cada ojo, 3 veces al día o según indicación. Para mejores resultados, mantener tratamiento continuo de 3 meses.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getHeroProduct, formatPrice } from '../data/products.js'
import { site } from '../data/site.js'

const product = getHeroProduct()

const discount = computed(() =>
  Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
)

const whatsappUrl = computed(() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  const msg = encodeURIComponent(product.whatsappMessage)
  return `https://wa.me/${num}?text=${msg}`
})
</script>

<style scoped>
.esplendor-section {
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-primary-pale) 100%);
  overflow: hidden;
}

.esplendor-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-12);
  align-items: center;
}

/* Benefits */
.esplendor-benefits { display: flex; flex-direction: column; gap: var(--space-4); }
.benefit-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: white;
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
  box-shadow: var(--shadow-sm);
  font-weight: 500;
  color: var(--color-text);
  border-left: 3px solid var(--color-primary);
  transition: all var(--transition-base);
}
.benefit-card:hover { transform: translateX(4px); box-shadow: var(--shadow-md); }
.benefit-icon {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.ingredients-block { margin-top: var(--space-4); }
.ingredients-block h4 { font-size: var(--text-base); margin-bottom: var(--space-3); font-family: var(--font-body); font-weight: 700; }
.ingredients-pills { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.ing-pill {
  background: var(--color-primary-pale);
  color: var(--color-primary);
  border: 1px solid rgba(45,125,70,0.2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

/* Center image */
.esplendor-img-wrapper {
  width: 320px;
  position: relative;
  display: flex;
  justify-content: center;
}
.esplendor-img-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(45,125,70,0.15), transparent 70%);
  border-radius: 50%;
}
.esplendor-img {
  width: 300px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 16px 40px rgba(45,125,70,0.3));
  animation: float 5s ease-in-out infinite;
}
.esplendor-stat {
  position: absolute;
  background: white;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  box-shadow: var(--shadow-lg);
  text-align: center;
}
.esplendor-stat-top { top: 10px; right: -30px; }
.esplendor-stat-bottom { bottom: 30px; left: -30px; }
.stat-num { display: block; font-size: var(--text-xl); font-weight: 800; color: var(--color-primary); }
.stat-label { font-size: var(--text-xs); color: var(--color-muted); }

/* Right info */
.esplendor-info { display: flex; flex-direction: column; gap: var(--space-5); }
.info-badge {
  display: inline-block;
  background: var(--color-primary-pale);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.05em;
}
.info-desc {
  font-size: var(--text-base);
  line-height: 1.8;
  white-space: pre-line;
  color: var(--color-text-light);
}
.info-price {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-accent-pale);
  border-radius: var(--radius-md);
  border: 1px solid rgba(200,162,39,0.2);
}
.info-ctas { display: flex; flex-direction: column; gap: var(--space-3); }
.how-to-use {
  background: white;
  border-radius: var(--radius-md);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
}
.how-to-use h5 { margin-bottom: var(--space-2); font-family: var(--font-body); font-weight: 700; }
.how-to-use p { font-size: var(--text-sm); }

/* Responsive */
@media (max-width: 1100px) {
  .esplendor-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; }
  .esplendor-img-wrapper { grid-column: 1 / -1; grid-row: 1; }
}
@media (max-width: 700px) {
  .esplendor-grid { grid-template-columns: 1fr; }
  .esplendor-img-wrapper { width: 100%; }
  .esplendor-stat-top, .esplendor-stat-bottom { display: none; }
}
</style>
