/**
 * useScrollAnimation.js
 * Composable para animaciones al entrar en viewport usando Intersection Observer.
 * Uso: const { observeEl } = useScrollAnimation()
 *      En template: ref="observeEl"  → añade clase 'visible' al entrar en viewport
 */
import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation(options = {}) {
  let observer = null

  const defaultOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
    ...options,
  }

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Uncomment to only animate once:
          // observer.unobserve(entry.target)
        }
      })
    }, defaultOptions)

    // Observar todos los elementos con clase 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { observer }
}
