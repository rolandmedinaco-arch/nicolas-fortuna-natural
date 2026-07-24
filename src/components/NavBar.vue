<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-inner">
      <!-- Logo -->
      <a href="#home" class="navbar-logo" @click.prevent="scrollTo('home')">
        <div class="logo-icon">🌿</div>
        <div class="logo-text">
          <span class="logo-brand">Fortuna</span>
          <span class="logo-accent">Natural</span>
        </div>
      </a>

      <!-- Nav Links (desktop) -->
      <nav class="navbar-nav" :class="{ open: menuOpen }">
        <a v-for="item in navItems" :key="item.id"
           href="#"
           class="nav-link"
           :class="{ active: activeSection === item.id }"
           @click.prevent="scrollTo(item.id); menuOpen = false">
          {{ item.label }}
        </a>
        <!-- Cart button -->
<button class="nav-cart-btn" @click="toggleCart">
  🛒
  <span v-if="cartCount > 0" class="nav-cart-badge">{{ cartCount }}</span>
</button>
        <a :href="whatsappUrl" target="_blank" class="btn btn-primary btn-sm nav-cta">
          💬 WhatsApp
        </a>
      </nav>

      <!-- Mobile hamburger -->
      <button class="hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu backdrop -->
    <Transition name="fade">
      <div v-if="menuOpen" class="nav-backdrop" @click="menuOpen = false"></div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { site } from '../data/site.js'
import { useCart } from '../composables/useCart.js'

const { cartCount, toggleCart } = useCart()

const isScrolled = ref(false)
const menuOpen = ref(false)
const activeSection = ref('home')

const navItems = [
  { id: 'home', label: 'Inicio' },
  { id: 'esplendor', label: 'Esplendor' },
  { id: 'productos', label: 'Productos' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'pagos', label: 'Comprar' },
  { id: 'contacto', label: 'Contacto' },
]

const whatsappUrl = computed(() =>
  `https://wa.me/${site.contact.whatsapp.replace(/\D/g, '')}?text=Hola! Me interesa conocer más sobre sus productos naturales.`
)

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  isScrolled.value = window.scrollY > 60

  // Update active section based on scroll position
  const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean)
  for (let i = sections.length - 1; i >= 0; i--) {
    const rect = sections[i].getBoundingClientRect()
    if (rect.top <= 100) {
      activeSection.value = navItems[i].id
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: var(--space-4) 0;
  transition: all var(--transition-slow);
}
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
  padding: var(--space-3) 0;
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
}
.logo-icon {
  font-size: 1.8rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.logo-brand {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--color-dark);
}
.logo-accent {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  color: var(--color-primary);
  font-style: italic;
}
.navbar:not(.scrolled) .logo-brand { color: white; }
.navbar:not(.scrolled) .logo-accent { color: var(--color-accent-light); }

/* Nav */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}
.nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  transition: color var(--transition-fast);
  position: relative;
  padding: var(--space-1) 0;
}
.navbar.scrolled .nav-link { color: var(--color-text-light); }
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-base);
  border-radius: var(--radius-full);
}
.nav-link:hover::after, .nav-link.active::after { width: 100%; }
.nav-link.active { color: var(--color-primary); font-weight: 600; }
.navbar:not(.scrolled) .nav-link.active { color: var(--color-accent-light); }
.nav-cta { margin-left: var(--space-2); }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-2);
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all var(--transition-base);
}
.navbar.scrolled .hamburger span { background: var(--color-dark); }
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: -1;
}
.nav-cart-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.4rem;
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

.nav-cart-btn:hover {
  transform: scale(1.15);
}

.nav-cart-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: #c62828;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .hamburger { display: flex; }
  .navbar-nav {
    position: fixed;
    top: 0;
    right: -100%;
    bottom: 0;
    width: min(300px, 80vw);
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-20) var(--space-8) var(--space-8);
    gap: var(--space-4);
    box-shadow: var(--shadow-xl);
    transition: right var(--transition-slow);
    z-index: 200;
  }
  .navbar-nav.open { right: 0; }
  .nav-link { color: var(--color-text) !important; font-size: var(--text-lg); }
  .nav-cta { margin-left: 0; margin-top: var(--space-4); }
  .hamburger { z-index: 300; }
}
</style>
