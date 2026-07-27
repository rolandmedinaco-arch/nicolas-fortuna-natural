/**
 * site.js
 * Configuración global del sitio — un solo lugar para cambiar datos de contacto,
 * redes sociales, pagos y configuraciones generales.
 */

export const site = {
  name: 'Fortuna Natural',
  brand: 'Esplendor',
  tagline: 'Salud Natural que Transforma Vidas',
  description: 'Productos naturales de alta calidad para tu salud visual, celular y bienestar integral.',
  url: 'https://fortunanatural.com',
  language: 'es',
  currency: 'COP',

  contact: {
    phone: '+573145397257',
    whatsapp: '+573145397257',
    email: 'contacto@fortunanatural.com',
    address: 'Colombia',
  },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100094624924994',
    instagram: 'https://www.instagram.com/soynicogil/',
    youtube: 'https://www.youtube.com/@ingresospasivos7/videos',
    tiktok: 'https://www.tiktok.com/@soynicolasgil',
    telegram: 'https://t.me/+3vw4VpABvqBlZDYx',
  },

  payments: {

    // Bree QR — Sube tu QR a Cloudinary y reemplaza la URL
    breeQR: {
      enabled: true,
      image: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1/pagos/bree-qr.webp',
      imagePlaceholder: '/images/bree-qr-placeholder.webp',
      instructions: 'Escanea el código QR con tu app bancaria o billetera digital para pagar desde cualquier banco.',
      title: 'Paga con tu Banco',
    },
  },

  cloudinary: {
    cloudName: 'TU_CLOUD_NAME', // ← Reemplaza con tu Cloud Name de Cloudinary
    baseUrl: 'https://res.cloudinary.com/TU_CLOUD_NAME',
  },

  stats: [
    { value: '6548', label: 'Esplendor', suffix: '+', icon: '👁️' },
    { value: '2543', label: 'Pro DHP', suffix: '+', icon: '🌿' },
    { value: '1285', label: 'Pro Oxcell', suffix: '+', icon: '⚡' },
    { value: '505', label: 'Pro Cell', suffix: '+', icon: '🔬' },
  ],

  promotions: [
    {
      id: 'individual',
      title: 'Producto Individual',
      discount: null,
      description: 'Precio regular de cada producto.',
      badge: null,
      highlight: false,
    },
    {
      id: 'duo',
      title: '2 Productos',
      discount: '20%',
      description: 'Al comprar 2 productos obtienes un 20% de descuento.',
      badge: '🔥 Popular',
      highlight: true,
    },
    {
      id: 'mayor',
      title: 'Mayor de 9 Unidades',
      discount: '40%',
      description: 'Precio mayorista — ideal para distribuidores.',
      badge: '💰 Mayorista',
      highlight: false,
    },
  ],
}
