<template>
  <div id="app">
    <NavBar v-if="!isCheckout" />
    <router-view />
    <FooterSection v-if="!isCheckout" />
    <CartDrawer v-if="!isCheckout" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
import CartDrawer from './components/CartDrawer.vue'

const route = useRoute()
const isCheckout = computed(() => route.path.startsWith('/checkout'))
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
