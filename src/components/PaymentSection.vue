<template>
  <section id="pagos" class="section payments-section">
    <div class="container">
      <!-- Header -->
      <div class="section-header animate-on-scroll">
        <span class="section-label">Pago Fácil y Seguro</span>
        <h2 class="section-title">¿Cómo <span>Comprar</span>?</h2>
        <div class="divider"></div>
        <p class="section-desc">Te ofrecemos múltiples formas de pago para que compres cómodo desde donde estés.</p>
      </div>

      <div class="payments-grid">
        <!-- Woopin card -->
        <div class="payment-card woopin-card animate-on-scroll from-left">
          <div class="payment-card-header">
            <div class="payment-icon">🛒</div>
            <h3>Pago con Woopin</h3>
            <p>Pasarela de pagos segura — tarjetas, PSE, y más.</p>
          </div>

          <div class="woopin-steps">
            <div v-for="(step, i) in woopinSteps" :key="i" class="woopin-step">
              <div class="step-num">{{ i + 1 }}</div>
              <div class="step-text">{{ step }}</div>
            </div>
          </div>

          <!-- Products list for Woopin -->
          <div class="woopin-products">
            <h5>Selecciona tu producto:</h5>
            <div class="woopin-product-list">
              <a
                v-for="p in products"
                :key="p.id"
                :href="p.woopinUrl"
                target="_blank"
                class="woopin-product-btn"
              >
                <span class="wpp-name">{{ p.name }}</span>
                <span class="wpp-price">{{ formatPrice(p.price) }}</span>
                <span class="wpp-arrow">→</span>
              </a>
            </div>
          </div>

          <div class="payment-logos">
            <span v-for="m in paymentMethods" :key="m" class="pm-pill">{{ m }}</span>
          </div>
        </div>

        <!-- Bree QR card -->
        <div class="payment-card bree-card animate-on-scroll from-right">
          <div class="payment-card-header">
            <div class="payment-icon">📱</div>
            <h3>Paga con tu Banco</h3>
            <p>Escanea el QR con tu app bancaria desde cualquier banco de Colombia.</p>
          </div>

          <!-- QR Code -->
          <div class="qr-wrapper">
            <div class="qr-frame">
              <img
                :src="breeQR.image"
                alt="QR Bree para pago"
                class="qr-img"
                @error="e => e.target.src = 'https://placehold.co/220x220/1a2e20/ffffff?text=QR+Bree'"
              />
              <div class="qr-logo">🌿</div>
            </div>
            <p class="qr-instructions">{{ breeQR.instructions }}</p>
          </div>

          <!-- How to scan steps -->
          <div class="bree-steps">
            <div v-for="(step, i) in breeSteps" :key="i" class="bree-step">
              <div class="bstep-icon">{{ step.icon }}</div>
              <div>
                <strong>{{ step.title }}</strong>
                <span>{{ step.desc }}</span>
              </div>
            </div>
          </div>

          <div class="bree-badge">
            Compatible con todos los bancos de Colombia
          </div>
        </div>

        <!-- Promotions card (full width) -->
        <div class="payment-card promos-card animate-on-scroll">
          <div class="payment-card-header text-center">
            <div class="payment-icon">🎁</div>
            <h3>Promociones y Descuentos</h3>
            <p>Entre más compras, más ahorras.</p>
          </div>

          <div class="promos-grid">
            <div
              v-for="promo in site.promotions"
              :key="promo.id"
              class="promo-box"
              :class="{ highlight: promo.highlight }"
            >
              <div v-if="promo.badge" class="promo-badge">{{ promo.badge }}</div>
              <h4>{{ promo.title }}</h4>
              <div class="promo-discount">
                <span v-if="promo.discount">{{ promo.discount }}</span>
                <span v-else>Precio Base</span>
              </div>
              <p>{{ promo.description }}</p>
              <a href="#productos" class="btn btn-primary btn-sm" style="align-self: center; margin-top: auto;">
                Ver Productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { site } from '../data/site.js'
import { products, formatPrice } from '../data/products.js'

const breeQR = site.payments.breeQR

const woopinSteps = [
  'Selecciona el producto que deseas comprar.',
  'Haz clic en "Comprar con Woopin".',
  'Completa tu información y elige tu método de pago.',
  'Confirma y recibe tu orden. ¡Listo!',
]

const breeSteps = [
  { icon: '📲', title: 'Abre tu app bancaria', desc: 'Cualquier banco de Colombia.' },
  { icon: '📷', title: 'Escanea el QR', desc: 'Cámara o lector QR dentro de la app.' },
  { icon: '✅', title: 'Confirma el pago', desc: 'Especifica monto y confirma.' },
  { icon: '🚀', title: 'Tu pedido procesado', desc: 'Recibe confirmación inmediata.' },
]

const paymentMethods = ['Visa', 'Mastercard', 'PSE', 'Nequi', 'Daviplata', 'Efecty']
</script>

<style scoped>
.payments-section {
  background: linear-gradient(180deg, var(--color-accent-pale) 0%, var(--color-primary-pale) 100%);
}

.payments-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--space-8);
}

.payment-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  border: 1px solid var(--color-border);
  transition: all var(--transition-slow);
}
.payment-card:hover { box-shadow: var(--shadow-xl); transform: translateY(-4px); }

.promos-card { grid-column: 1 / -1; }

/* Card header */
.payment-card-header { text-align: left; }
.payment-icon { font-size: 2.5rem; margin-bottom: var(--space-3); }
.payment-card-header h3 {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-2);
  color: var(--color-dark);
}
.payment-card-header p { color: var(--color-text-muted); font-size: var(--text-sm); }
.text-center { text-align: center; }

/* Woopin steps */
.woopin-steps { display: flex; flex-direction: column; gap: var(--space-3); }
.woopin-step {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-light);
}
.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  font-size: var(--text-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Woopin product list */
.woopin-products h5 {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--color-text);
}
.woopin-product-list { display: flex; flex-direction: column; gap: var(--space-2); }
.woopin-product-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-pale);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  border: 1px solid transparent;
}
.woopin-product-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.wpp-name { font-weight: 600; font-size: var(--text-sm); flex: 1; }
.wpp-price { font-size: var(--text-sm); font-weight: 700; color: var(--color-primary); }
.woopin-product-btn:hover .wpp-price { color: white; }
.wpp-arrow { font-size: 1rem; color: var(--color-muted); }

/* Payment method badges */
.payment-logos { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.pm-pill {
  padding: 4px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
}

/* QR */
.qr-wrapper { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
.qr-frame {
  position: relative;
  display: inline-block;
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-lg);
  border: 3px solid var(--color-primary);
  box-shadow: var(--shadow-lg);
}
.qr-img { width: 200px; height: 200px; object-fit: contain; display: block; border-radius: var(--radius-md); }
.qr-logo {
  position: absolute;
  bottom: -16px;
  right: -16px;
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 3px solid white;
  box-shadow: var(--shadow-md);
}
.qr-instructions { font-size: var(--text-sm); text-align: center; color: var(--color-text-muted); max-width: 280px; }

/* Bree steps */
.bree-steps { display: flex; flex-direction: column; gap: var(--space-4); }
.bree-step { display: flex; align-items: flex-start; gap: var(--space-3); }
.bstep-icon { font-size: 1.4rem; flex-shrink: 0; }
.bree-step strong { display: block; font-size: var(--text-sm); color: var(--color-dark); }
.bree-step span { font-size: var(--text-xs); color: var(--color-text-muted); }

.bree-badge {
  background: var(--color-primary-pale);
  color: var(--color-primary);
  border: 1px solid rgba(45,125,70,0.2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 600;
  text-align: center;
}

/* Promos */
.promos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}
.promo-box {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: all var(--transition-base);
}
.promo-box:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
.promo-box.highlight {
  border-color: var(--color-accent);
  background: var(--color-accent-pale);
  box-shadow: var(--shadow-green);
}
.promo-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent);
  color: var(--color-dark);
  padding: 4px 16px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  white-space: nowrap;
}
.promo-box h4 { font-family: var(--font-heading); font-size: var(--text-xl); }
.promo-discount {
  font-size: var(--text-4xl);
  font-weight: 900;
  color: var(--color-primary);
  font-family: var(--font-heading);
}
.promo-box p { font-size: var(--text-sm); color: var(--color-text-muted); }

/* Responsive */
@media (max-width: 900px) {
  .payments-grid { grid-template-columns: 1fr; }
  .promos-card { grid-column: 1; }
  .promos-grid { grid-template-columns: 1fr; }
}
</style>
