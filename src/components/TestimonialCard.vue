<template>
  <div class="testimonial-card">
    <!-- Video type -->
    <template v-if="testimonial.type === 'video'">
      <div class="tc-video-wrap" @click="$emit('play-video', testimonial.videoUrl)">
        <img
          :src="testimonial.videoThumbnail || 'https://placehold.co/400x250/1a2e20/ffffff?text=Video'"
          :alt="testimonial.name"
          class="tc-thumb"
        />
        <div class="tc-play-overlay">
          <div class="tc-play-btn">▶</div>
        </div>
        <div class="tc-video-badge">🎥 Video Testimonio</div>
      </div>
    </template>

    <!-- Text type -->
    <div class="tc-body">
      <!-- Quote -->
      <div class="tc-quote">"</div>
      <p class="tc-text">"{{ testimonial.text }}"</p>

      <!-- Stars -->
      <div class="stars">
        <span v-for="i in 5" :key="i" class="star" :class="{ empty: i > testimonial.rating }">★</span>
      </div>

      <!-- Author -->
      <div class="tc-author">
        <div class="tc-avatar">
          <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.name" />
          <span v-else class="avatar-initials">{{ initials }}</span>
        </div>
        <div class="tc-meta">
          <strong>{{ testimonial.name }}</strong>
          <span>{{ testimonial.location }}</span>
          <span class="tc-product">Producto: {{ testimonial.product }}</span>
        </div>
        <div v-if="testimonial.verified" class="tc-verified" title="Compra Verificada">✅</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ testimonial: { type: Object, required: true } })
defineEmits(['play-video'])

const initials = computed(() =>
  props.testimonial.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
)
</script>

<style scoped>
.testimonial-card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-lg);
  overflow: hidden;
  backdrop-filter: blur(8px);
  transition: all var(--transition-slow);
  height: 100%;
  display: flex;
  flex-direction: column;
}
.testimonial-card:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(200,162,39,0.3);
  transform: translateY(-4px);
}

/* Video */
.tc-video-wrap {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 16/9;
}
.tc-thumb { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
.tc-video-wrap:hover .tc-thumb { transform: scale(1.05); }
.tc-play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.tc-play-btn {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.95);
  color: var(--color-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  padding-left: 4px;
  transition: transform var(--transition-spring);
  box-shadow: var(--shadow-lg);
}
.tc-video-wrap:hover .tc-play-btn { transform: scale(1.1); }
.tc-video-badge {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  background: var(--color-accent);
  color: var(--color-dark);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
}

/* Body */
.tc-body { padding: var(--space-6); flex: 1; display: flex; flex-direction: column; gap: var(--space-4); }
.tc-quote {
  font-family: var(--font-heading);
  font-size: 4rem;
  line-height: 0.5;
  color: var(--color-accent);
  opacity: 0.5;
}
.tc-text {
  color: rgba(255,255,255,0.85);
  font-size: var(--text-sm);
  line-height: 1.8;
  font-style: italic;
  flex: 1;
}

/* Author */
.tc-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255,255,255,0.1);
}
.tc-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tc-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials { font-weight: 700; font-size: 1rem; color: white; }
.tc-meta { flex: 1; }
.tc-meta strong { display: block; color: white; font-size: var(--text-sm); }
.tc-meta span { display: block; color: rgba(255,255,255,0.5); font-size: var(--text-xs); }
.tc-product { color: var(--color-accent-light) !important; font-weight: 600 !important; }
.tc-verified { font-size: 1.1rem; }
</style>
