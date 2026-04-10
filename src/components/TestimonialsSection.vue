<template>
  <section id="testimonios" class="section testimonials-section">
    <div class="container">
      <!-- Header -->
      <div class="section-header animate-on-scroll">
        <span class="section-label">Historias Reales</span>
        <h2 class="section-title">Lo que dicen nuestros <span>Clientes</span></h2>
        <div class="divider"></div>
        <p class="section-desc">Miles de personas han transformado su vida con nuestros productos. Conoce sus historias.</p>
      </div>

      <!-- Tabs: texto / video -->
      <div class="testimonial-tabs animate-on-scroll">
        <button class="tab-btn" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">Todos</button>
        <button class="tab-btn" :class="{ active: activeTab === 'text' }" @click="activeTab = 'text'">✍️ Escritos</button>
        <button class="tab-btn" :class="{ active: activeTab === 'video' }" @click="activeTab = 'video'">🎥 Videos</button>
      </div>

      <!-- Carousel -->
      <div class="testimonials-carousel animate-on-scroll">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(t, i) in filteredTestimonials" :key="t.id" class="carousel-slide">
            <TestimonialCard :testimonial="t" @play-video="openVideo" />
          </div>
        </div>

        <!-- Controls -->
        <button class="carousel-btn carousel-prev" @click="prev" :disabled="currentIndex === 0">←</button>
        <button class="carousel-btn carousel-next" @click="next" :disabled="currentIndex >= maxIndex">→</button>
      </div>

      <!-- Dots -->
      <div class="carousel-dots animate-on-scroll">
        <button
          v-for="(_, i) in dotCount"
          :key="i"
          class="dot"
          :class="{ active: currentIndex === i }"
          @click="currentIndex = i"
        ></button>
      </div>

      <!-- Stats bar -->
      <div class="trust-stats animate-on-scroll">
        <div class="trust-stat">
          <span class="trust-num">⭐ 4.9</span>
          <span class="trust-label">Calificación promedio</span>
        </div>
        <div class="trust-divider"></div>
        <div class="trust-stat">
          <span class="trust-num">{{ testimonials.length * 1200 }}+</span>
          <span class="trust-label">Clientes satisfechos</span>
        </div>
        <div class="trust-divider"></div>
        <div class="trust-stat">
          <span class="trust-num">98%</span>
          <span class="trust-label">Recomendarían el producto</span>
        </div>
      </div>
    </div>

    <!-- Video modal -->
    <Transition name="modal">
      <div v-if="activeVideo" class="modal-overlay" @click.self="activeVideo = null">
        <div class="video-modal-box">
          <button class="modal-close" @click="activeVideo = null">✕</button>
          <video
            :src="activeVideo"
            controls
            autoplay
            class="modal-video"
          ></video>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { testimonials } from '../data/testimonials.js'
import TestimonialCard from './TestimonialCard.vue'

const activeTab = ref('all')
const currentIndex = ref(0)
const activeVideo = ref(null)
const visibleCount = ref(3) // cards visible at once (desktop)

const filteredTestimonials = computed(() => {
  if (activeTab.value === 'all') return testimonials
  return testimonials.filter(t => t.type === activeTab.value)
})

const maxIndex = computed(() => Math.max(0, filteredTestimonials.value.length - visibleCount.value))
const dotCount = computed(() => maxIndex.value + 1)

watch(activeTab, () => (currentIndex.value = 0))

function prev() { if (currentIndex.value > 0) currentIndex.value-- }
function next() { if (currentIndex.value < maxIndex.value) currentIndex.value++ }
function openVideo(url) { activeVideo.value = url }

// Auto-advance every 5s
let autoTimer
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  autoTimer = setInterval(() => {
    if (currentIndex.value < maxIndex.value) currentIndex.value++
    else currentIndex.value = 0
  }, 5000)
})
onUnmounted(() => clearInterval(autoTimer))
</script>

<style scoped>
.testimonials-section {
  background: linear-gradient(135deg, var(--color-dark) 0%, var(--color-dark-2) 100%);
  overflow: hidden;
}
.testimonials-section :deep(.section-label) { background: rgba(200,162,39,0.15); color: var(--color-accent-light); }
.testimonials-section :deep(.section-title) { color: white; }
.testimonials-section :deep(.section-desc) { color: rgba(255,255,255,0.7); }

/* Tabs */
.testimonial-tabs {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-10);
}
.tab-btn {
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  transition: all var(--transition-base);
}
.tab-btn:hover { background: rgba(255,255,255,0.15); color: white; }
.tab-btn.active {
  background: var(--color-accent);
  color: var(--color-dark);
  border-color: var(--color-accent);
}

/* Carousel */
.testimonials-carousel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
}
.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.carousel-slide {
  min-width: calc(100% / 3);
  padding: 0 var(--space-3);
  box-sizing: border-box;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 1.2rem;
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  z-index: 10;
  backdrop-filter: blur(8px);
}
.carousel-btn:hover:not(:disabled) { background: var(--color-accent); color: var(--color-dark); }
.carousel-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.carousel-prev { left: var(--space-2); }
.carousel-next { right: var(--space-2); }

/* Dots */
.carousel-dots { display: flex; gap: var(--space-2); justify-content: center; margin-bottom: var(--space-12); }
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transition: all var(--transition-base);
}
.dot.active { background: var(--color-accent); width: 24px; border-radius: 4px; }

/* Stats */
.trust-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  flex-wrap: wrap;
}
.trust-stat { text-align: center; }
.trust-num { display: block; font-size: var(--text-3xl); font-weight: 800; color: var(--color-accent-light); }
.trust-label { font-size: var(--text-xs); color: rgba(255,255,255,0.6); }
.trust-divider { width: 1px; height: 50px; background: rgba(255,255,255,0.15); }

/* Video modal */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.video-modal-box {
  background: #000;
  border-radius: var(--radius-lg);
  max-width: 800px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.modal-video { width: 100%; display: block; max-height: 80vh; }

@media (max-width: 900px) {
  .carousel-slide { min-width: 100%; }
}
@media (max-width: 600px) {
  .trust-divider { display: none; }
  .trust-stats { gap: var(--space-6); }
}
</style>
