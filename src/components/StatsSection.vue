<template>
  <div class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div
          v-for="(stat, i) in site.stats"
          :key="i"
          class="stat-item animate-on-scroll"
          :class="`delay-${i + 1}`"
        >
          <span class="stat-icon">{{ stat.icon }}</span>
          <div class="stat-number">
            <span class="counter-val" :data-target="stat.value">{{ displayValues[i] }}</span>
            <span class="stat-suffix">{{ stat.suffix }}</span>
          </div>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { site } from '../data/site.js'

const displayValues = ref(site.stats.map(() => '0'))

function animateCounter(index, target, duration = 2000) {
  const start = 0
  const end = parseInt(target.replace(/\D/g, ''))
  const range = end - start
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
    const current = Math.round(start + range * eased)
    displayValues.value[index] = current.toLocaleString('es-CO')
    if (progress < 1) requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          site.stats.forEach((stat, i) => animateCounter(i, stat.value))
          observer.disconnect()
        }
      })
    },
    { threshold: 0.5 }
  )

  const el = document.querySelector('.stats-section')
  if (el) observer.observe(el)
})
</script>

<style scoped>
.stats-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark-3) 100%);
  padding: var(--space-16) 0;
  position: relative;
  overflow: hidden;
}
.stats-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
  padding: var(--space-8);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  transition: all var(--transition-base);
}
.stat-item:hover {
  background: rgba(255,255,255,0.12);
  transform: translateY(-4px);
}

.stat-icon { display: block; font-size: 2.2rem; margin-bottom: var(--space-3); }
.stat-number {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: var(--space-2);
}
.counter-val {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  font-weight: 900;
  color: white;
  line-height: 1;
}
.stat-suffix { font-size: var(--text-3xl); font-weight: 900; color: var(--color-accent-light); }
.stat-label { font-size: var(--text-sm); color: rgba(255,255,255,0.65); display: block; }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 400px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
