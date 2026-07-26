<template>
  <div id="app">
    <NavBar />
    <router-view />
    <FooterSection />
    <CartDrawer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
import CartDrawer from './components/CartDrawer.vue'
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
