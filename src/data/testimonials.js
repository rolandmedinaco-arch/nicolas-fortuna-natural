/**
 * testimonials.js
 * Testimonios de clientes — soporta texto y video de Cloudinary.
 * Para videos: sube el video a Cloudinary y reemplaza la URL.
 */

export const testimonials = [
  {
    id: 1,
    name: 'María González',
    location: 'Bogotá, Colombia',
    avatar: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1/testimonios/maria.webp',
    avatarPlaceholder: null, // null = usar iniciales
    rating: 5,
    type: 'text', // 'text' | 'video'
    text: 'Después de 2 meses usando Esplendor, mi visión mejoró notablemente. Ya no necesito mis lentes para leer. ¡Es increíble!',
    videoUrl: null,
    videoThumbnail: null,
    product: 'Esplendor',
    date: '2025-12-15',
    verified: true,
  },
  {
    id: 2,
    name: 'Carlos Mejía',
    location: 'Medellín, Colombia',
    avatar: null,
    avatarPlaceholder: null,
    rating: 5,
    type: 'video',
    text: 'Mi testimonio sobre Pro Cell — cómo transformó mi energía diaria.',
    videoUrl: 'https://res.cloudinary.com/TU_CLOUD_NAME/video/upload/v1/testimonios/carlos-procell.mp4',
    videoThumbnail: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1/testimonios/carlos-thumb.webp',
    product: 'Pro Cell',
    date: '2026-01-10',
    verified: true,
  },
  {
    id: 3,
    name: 'Ana Rodríguez',
    location: 'Cali, Colombia',
    avatar: null,
    avatarPlaceholder: null,
    rating: 5,
    type: 'text',
    text: 'Los resultados con Esplendor son reales. Mis cataratas comenzaron a reducirse y mi oftalmólogo quedó sorprendido.',
    videoUrl: null,
    videoThumbnail: null,
    product: 'Esplendor',
    date: '2026-02-03',
    verified: true,
  },
  {
    id: 4,
    name: 'Roberto Díaz',
    location: 'Barranquilla, Colombia',
    avatar: null,
    avatarPlaceholder: null,
    rating: 5,
    type: 'video',
    text: 'Testimonio sobre Pro DHP y mi recuperación digestiva.',
    videoUrl: 'https://res.cloudinary.com/TU_CLOUD_NAME/video/upload/v1/testimonios/roberto-prodhp.mp4',
    videoThumbnail: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1/testimonios/roberto-thumb.webp',
    product: 'Pro DHP',
    date: '2026-02-20',
    verified: true,
  },
  {
    id: 5,
    name: 'Patricia López',
    location: 'Bucaramanga, Colombia',
    avatar: null,
    avatarPlaceholder: null,
    rating: 5,
    type: 'text',
    text: 'Empecé con Esplendor hace 3 meses con miopía severa. Hoy mi visión mejoró en un 40%. ¡Gracias por este producto natural!',
    videoUrl: null,
    videoThumbnail: null,
    product: 'Esplendor',
    date: '2026-03-01',
    verified: true,
  },
]

// Helper para obtener solo testimonios con video
export const getVideoTestimonials = () => testimonials.filter(t => t.type === 'video')
export const getTextTestimonials = () => testimonials.filter(t => t.type === 'text')
