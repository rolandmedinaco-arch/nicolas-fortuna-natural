<template>
  <div>
    <HeroSection />
    <EsplendorSection />
    <StatsSection />
    <ProductsSection />
    <TestimonialsSection />
    <PaymentSection />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import EsplendorSection from '../components/EsplendorSection.vue'
import StatsSection from '../components/StatsSection.vue'
import ProductsSection from '../components/ProductsSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import PaymentSection from '../components/PaymentSection.vue'
import { useScrollAnimation } from '../composables/useScrollAnimation.js'

useScrollAnimation()
</script>