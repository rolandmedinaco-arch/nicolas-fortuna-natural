# 🌿 Fortuna Natural — Sitio Web de Productos Naturales

Sitio web de landing page para la línea de productos naturales **Fortuna Natural** de Nicolás Gil (Winner / ACN Flash). Desarrollado con **Vue 3 + Vite**, diseñado para presentar el catálogo de productos nutracéuticos, gestionar conversiones vía WhatsApp y Woopin, y mostrar testimonios de clientes.

---

## 🛍️ Catálogo de Productos

| Producto | Categoría | Descripción |
|---|---|---|
| **Esplendor** ⭐ | Salud Ocular | Lágrimas homeopáticas naturales · 15 ml |
| **Pro Cell** | Regeneración Celular | Circulación, articulaciones e inmunidad |
| **Pro DHP** | Regeneración Celular | Biodrenante hepático y digestivo |
| **Pro Oxcell** | Regeneración Celular | Sistema nervioso y oxigenación cerebral |
| **P-C** | Regeneración Celular | Bienestar masculino integral |
| **Pro Diureck** | Depuración Renal | Biodrenante renal y diurético natural |
| **Elixir** | Belleza & Bienestar | Antienvejecimiento y renovación celular |
| **Keratina** | Salud Capilar | Restauración y fortalecimiento capilar |

---

## 🧱 Stack Tecnológico

- **Vue 3** — Framework reactivo con `<script setup>` (Composition API)
- **Vite 8** — Build tool ultrarrápido con HMR
- **Vanilla CSS** — Sistema de diseño con variables CSS custom properties
- **Sin dependencias externas de UI** — Sin Tailwind, sin Bootstrap

---

## 📁 Estructura del Proyecto

```
web-nicogil/
├── public/
│   ├── images/          # Imágenes de productos (locales)
│   │   ├── esplendor.png
│   │   ├── pro-cell.jpg
│   │   ├── pro-dhp.jpg
│   │   ├── pro-oxcell.jpg
│   │   ├── pro-c.jpg
│   │   └── pro-diureck.jpg
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/          # Assets estáticos del build
│   ├── components/      # Componentes Vue
│   │   ├── NavBar.vue
│   │   ├── HeroSection.vue
│   │   ├── EsplendorSection.vue
│   │   ├── ProductsSection.vue
│   │   ├── ProductCard.vue
│   │   ├── StatsSection.vue
│   │   ├── TestimonialsSection.vue
│   │   ├── TestimonialCard.vue
│   │   ├── PaymentSection.vue
│   │   └── FooterSection.vue
│   ├── composables/     # Lógica reutilizable (Vue composables)
│   ├── data/            # ⭐ Fuente única de verdad
│   │   ├── products.js  # Catálogo de productos
│   │   ├── site.js      # Config global: contacto, redes, pagos
│   │   └── testimonials.js
│   ├── App.vue
│   ├── main.js
│   └── style.css        # Sistema de diseño (tokens CSS)
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

---

## 🔧 Configuración

### Agregar o editar un producto

Editar `src/data/products.js`. Cada producto es un objeto con la siguiente estructura:

```js
{
  id: 'nombre-id',
  slug: 'url-slug',
  name: 'Nombre del Producto',
  tagline: 'Subtítulo breve',
  shortDescription: 'Descripción corta para la tarjeta.',
  fullDescription: `Descripción larga para la sección de detalle.`,
  benefits: ['Beneficio 1', 'Beneficio 2'],
  ingredients: ['Ingrediente 1', 'Ingrediente 2'],
  price: 140000,
  originalPrice: 160000,
  currency: 'COP',
  image: '/images/nombre-imagen.jpg',   // Ruta local en public/images/
  woopinUrl: 'https://woopin.co/TU_LINK',
  category: CATEGORIES.CELULAR,
  isFeatured: true,
  isHero: false,
  badge: '🔥 Popular',
  stock: 'available',
  tags: ['tag1', 'tag2'],
  whatsappMessage: 'Mensaje para WhatsApp...',
}
```

### Actualizar datos de contacto y redes sociales

Editar `src/data/site.js`:

```js
contact: {
  phone: '+57XXXXXXXXXX',
  whatsapp: '+57XXXXXXXXXX',
  email: 'correo@dominio.com',
},
social: {
  instagram: 'https://www.instagram.com/...',
  facebook: 'https://www.facebook.com/...',
  // ...
}
```

### Agregar imágenes de productos

1. Copiar la imagen a `public/images/`
2. Actualizar el campo `image` del producto en `products.js`:
   ```js
   image: '/images/nombre-archivo.jpg',
   ```

---

## 💳 Pasarelas de Pago

- **Woopin** — Configurado por producto (campo `woopinUrl` en `products.js`)
- **Bree QR** — Configurado en `site.js` > `payments.breeQR`

---

## 🌐 Despliegue

El proyecto genera archivos estáticos compatibles con cualquier hosting:
- **Netlify** / **Vercel** — Conectar repositorio GitHub, build command: `npm run build`, publish dir: `dist/`
- **GitHub Pages** — Requiere configurar `base` en `vite.config.js`

---

## 📞 Contacto

**Nicolás Gil** — Winner / ACN Flash  
📱 WhatsApp: [+57 314 539 7257](https://wa.me/573145397257)  
📸 Instagram: [@soynicogil](https://www.instagram.com/soynicogil/)  
🎥 TikTok: [@soynicolasgil](https://www.tiktok.com/@soynicolasgil)
