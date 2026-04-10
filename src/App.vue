<template>
  <div id="app">
    <NavBar />
    <HeroSection />
    <EsplendorSection />
    <StatsSection />
    <ProductsSection />
    <TestimonialsSection />
    <PaymentSection />
    <FooterSection />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import EsplendorSection from './components/EsplendorSection.vue'
import StatsSection from './components/StatsSection.vue'
import ProductsSection from './components/ProductsSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import PaymentSection from './components/PaymentSection.vue'
import FooterSection from './components/FooterSection.vue'
import { useScrollAnimation } from './composables/useScrollAnimation.js'

// Initialize scroll animations
useScrollAnimation()
</script>

<style>
/* App-level overrides */
#app {
  min-height: 100vh;
  font-family: var(--font-body);
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-primary-light); }
</style>
