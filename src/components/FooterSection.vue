<template>
  <footer id="contacto" class="footer">
    <!-- Wave top -->
    <div class="footer-wave">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#0f1a12"/>
      </svg>
    </div>

    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand column -->
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="footer-logo-icon">🌿</span>
              <div>
                <span class="footer-logo-name">Fortuna Natural</span>
                <span class="footer-logo-tag">Salud que Transforma</span>
              </div>
            </div>
            <p class="footer-desc">
              Transformamos vidas a través de productos naturales de la más alta calidad, formulados con ingredientes puros y efectivos.
            </p>
            <!-- Social links -->
            <div class="social-links">
              <a :href="site.social.facebook" target="_blank" class="social-btn" title="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a :href="site.social.instagram" target="_blank" class="social-btn" title="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a :href="site.social.youtube" target="_blank" class="social-btn" title="YouTube">
                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
              <a :href="site.social.tiktok" target="_blank" class="social-btn" title="TikTok">
                <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z"/></svg>
              </a>
              <a :href="site.social.telegram" target="_blank" class="social-btn" title="Telegram">
                <svg viewBox="0 0 24 24"><path d="M21.5 2.5L2 10.5l7 2.5 2.5 7 3.5-5.5 5.5 3.5L21.5 2.5z"/></svg>
              </a>
            </div>
          </div>

          <!-- Products column -->
          <div class="footer-col">
            <h4>Productos</h4>
            <ul>
              <li v-for="p in products" :key="p.id">
                <a :href="p.woopinUrl" target="_blank">{{ p.name }}</a>
              </li>
            </ul>
          </div>

          <!-- Links column -->
          <div class="footer-col">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#home">Inicio</a></li>
              <li><a href="#esplendor">Esplendor</a></li>
              <li><a href="#productos">Productos</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
              <li><a href="#pagos">Cómo Comprar</a></li>
            </ul>
          </div>

          <!-- Contact column -->
          <div class="footer-col">
            <h4>Contáctanos</h4>
            <div class="footer-contact-items">
              <a :href="`tel:${site.contact.phone}`" class="footer-contact-item">
                <span>📞</span>
                <span>{{ site.contact.phone }}</span>
              </a>
              <a :href="`mailto:${site.contact.email}`" class="footer-contact-item">
                <span>✉️</span>
                <span>{{ site.contact.email }}</span>
              </a>
              <div class="footer-contact-item">
                <span>🌎</span>
                <span>Envíos a toda Colombia</span>
              </div>
            </div>

            <!-- WhatsApp CTA -->
            <a :href="waUrl" target="_blank" class="footer-wa-btn">
              💬 Escribir al WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer bottom -->
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© {{ year }} Fortuna Natural. Todos los derechos reservados.</p>
        <p class="footer-made">Hecho con 💚 en Colombia</p>
      </div>
    </div>

    <!-- WhatsApp floating button -->
    <a :href="waUrl" target="_blank" class="whatsapp-float" title="Chatea por WhatsApp">
      <svg viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    </a>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { site } from '../data/site.js'
import { products } from '../data/products.js'

const year = new Date().getFullYear()

const waUrl = computed(() => {
  const num = site.contact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent('Hola! Me interesa conocer más sobre sus productos naturales.')}`
})
</script>

<style scoped>
.footer {
  position: relative;
  background: var(--color-dark);
}

.footer-wave {
  margin-top: -2px;
}
.footer-wave svg {
  width: 100%;
  height: 80px;
  display: block;
}

.footer-main { padding: var(--space-16) 0 var(--space-12); }

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: var(--space-12);
  align-items: start;
}

/* Brand */
.footer-brand { display: flex; flex-direction: column; gap: var(--space-6); }
.footer-logo { display: flex; align-items: center; gap: var(--space-3); }
.footer-logo-icon { font-size: 2rem; }
.footer-logo-name { display: block; font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 900; color: white; }
.footer-logo-tag { display: block; font-size: var(--text-xs); color: var(--color-primary-light); font-style: italic; }
.footer-desc { font-size: var(--text-sm); color: rgba(255,255,255,0.55); line-height: 1.7; }

/* Social */
.social-links { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.social-btn {
  width: 38px;
  height: 38px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}
.social-btn svg {
  width: 16px;
  height: 16px;
  stroke: rgba(255,255,255,0.7);
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.social-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.social-btn:hover svg { stroke: white; }

/* Footer columns */
.footer-col h4 {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  color: white;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-5);
}
.footer-col ul { display: flex; flex-direction: column; gap: var(--space-3); }
.footer-col a {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.55);
  transition: color var(--transition-fast);
}
.footer-col a:hover { color: var(--color-accent-light); }

/* Contact */
.footer-contact-items { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-5); }
.footer-contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.6);
  transition: color var(--transition-fast);
}
.footer-contact-item:hover { color: var(--color-accent-light); }

.footer-wa-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: #25d366;
  color: white;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all var(--transition-base);
}
.footer-wa-btn:hover { background: #1ebe5a; transform: translateY(-2px); }

/* Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: var(--space-5) 0;
}
.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}
.footer-bottom p { font-size: var(--text-xs); color: rgba(255,255,255,0.35); }
.footer-made { color: rgba(255,255,255,0.35) !important; }

@media (max-width: 1000px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--space-10); }
  .footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom-inner { flex-direction: column; text-align: center; }
}
</style>
