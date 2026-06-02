/**
 * products.js
 * Fuente única de verdad para todos los productos.
 * Para agregar un producto nuevo, agrega un objeto al array.
 * Imágenes hosteadas en Cloudinary — reemplaza las URLs cuando subas tus imágenes.
 */

export const CATEGORIES = {
  OCULAR: 'Salud Ocular',
  CELULAR: 'Regeneración Celular',
  RENAL: 'Depuración Renal',
  CAPILAR: 'Salud Capilar',
  BEAUTY: 'Belleza & Bienestar',
}

export const products = [
  {
    id: 'esplendor',
    slug: 'esplendor',
    name: 'Esplendor',
    tagline: 'La Luz de Tus Ojos',
    shortDescription: 'Fórmula exclusiva de ingredientes naturales que nutre, refresca y restaura tu mirada, combatiendo la fatiga visual y el daño causado por pantallas.',
    fullDescription: `Esplendor contiene una exclusiva fórmula de poderosos ingredientes naturales que hidratan, refrescan y relajan integralmente el contorno de los ojos, ayudando a restaurar la función ocular desde adentro.

Nutre y protege la córnea, previene y corrige la sequedad ocular, y favorece el rejuvenecimiento celular y la recuperación de los tejidos. Compatible con tratamientos oftalmológicos y sin necesidad de prescripción médica.

Disponible en Colombia, Ecuador, Perú, Bolivia, Venezuela, Panamá, Argentina, España, México y Estados Unidos.

📌 Contenido: 15 ml · Uso sugerido: 3 gotas al día en cada ojo.`,
    benefits: [
      'Nutre y protege la córnea',
      'Previene y corrige la sequedad ocular',
      'Calma y relaja la visión',
      'Hidratación progresiva y duradera',
      'Favorece el descanso visual',
      'Restablece la función de las glándulas lagrimales',
      'Rejuvenecimiento celular y recuperación de tejidos',
      'Reduce la fatiga visual por pantallas y lectura',
      'Protege frente al daño de radicales libres',
    ],
    ingredients: ['Aloe Vera', 'Clorofila', 'Colágeno', 'Luteína', 'Zeaxantina', 'Carotenoides'],
    useCases: ['Conjuntivitis', 'Orzuelos', 'Queratitis', 'Astigmatismo', 'Pterigión', 'Cataratas', 'Glaucoma'],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: '/images/esplendor.png',
    imagePlaceholder: '/images/esplendor.png',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_ESPLENDOR', // ← Reemplaza con tu URL real de Woopin
    category: CATEGORIES.OCULAR,
    isFeatured: true,
    isHero: true, // Producto principal del Hero
    badge: '⭐ Más Vendido',
    stock: 'available', // 'available' | 'out_of_stock' | 'limited'
    tags: ['ojos', 'visión', 'natural', 'gotas', 'córnea', 'cataratas'],
    whatsappMessage: 'Hola! Me interesa el producto Esplendor para el cuidado visual. ¿Me pueden dar más información?',
  },
  {
    id: 'procell',
    slug: 'pro-cell',
    name: 'Pro Cell',
    tagline: 'Bienestar y Protección Integral para tu Cuerpo',
    shortDescription: 'Fórmula natural que apoya la circulación, la movilidad articular, las defensas y la desintoxicación celular para recuperar vitalidad de forma progresiva.',
    fullDescription: `Pro Cell es una fórmula diseñada para apoyar el equilibrio natural del organismo en sus áreas más importantes: circulación, movilidad articular, fortalecimiento inmunológico y desintoxicación celular.

Su acción favorece la fluidez sanguínea y el retorno venoso, reduce procesos inflamatorios en articulaciones y tejido conectivo, estimula la producción natural de defensas y depura el torrente sanguíneo de desechos metabólicos, lo que se traduce en mayor vitalidad y una piel más sana desde adentro.

Amplamente utilizado por personas con várices, artritis, reumatismo, gota, lumbago, osteoartritis, alergias cutáneas y cuadros virales.

📌 Dosis recomendada: 10 a 20 gotas después de cada comida.`,
    benefits: [
      'Apoya la circulación y el bienestar cardiovascular',
      'Favorece la movilidad y el bienestar articular',
      'Ayuda en artritis, reumatismo, gota y lumbago',
      'Reduce hinchazón de manos, pies y tobillos',
      'Estimula y fortalece el sistema inmunológico',
      'Desintoxicación celular profunda',
      'Apoya el equilibrio en cuadros virales',
      'Favorece la limpieza natural de la piel',
    ],
    ingredients: [],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: '/images/pro-cell.jpg',
    imagePlaceholder: '/images/pro-cell.jpg',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_PROCELL',
    category: CATEGORIES.CELULAR,
    isFeatured: true,
    isHero: false,
    badge: '🔥 Popular',
    stock: 'available',
    tags: ['circulación', 'articulaciones', 'defensas', 'desintoxicación', 'várices', 'natural'],
    whatsappMessage: 'Hola! Me interesa Pro Cell para el bienestar y la circulación. ¿Me pueden dar más información?',
  },
  {
    id: 'prodhp',
    slug: 'pro-dhp',
    name: 'Pro DHP',
    tagline: 'Biodrenante Hepático & Restauración Digestiva',
    shortDescription: 'Fórmula natural con Cúrcuma, Sangre de Drago y Moringa para drenar el hígado, estimular la bilis y reparar el tracto digestivo sin efectos secundarios.',
    fullDescription: `Pro DHP es un potente biodrenante hepático y digestivo formulado con extractos herbales de alta pureza como Cúrcuma, Sangre de Drago, Moringa y Pimienta Negra, que actúan en sinergia para restaurar la función del hígado y la vesícula desde adentro.

Estimula la secreción biliar y actúa como desintoxicante hepático profundo, siendo un coadyuvante en el manejo de hígado graso, hepatitis, cirrosis y colelitiasis. La Sangre de Drago y el Matico aceleran la reparación de tejidos en gastritis, úlceras y colitis, reduciendo acidez, reflujo y distensión abdominal.

Elimina la boca amarga, gases y náuseas causados por residuos fermentativos. También actúa como desinflamante sistémico, con beneficios extendidos a próstata, ovarios y sistema linfático.

📌 Dosis recomendada: 10 a 20 gotas en agua o sublingual después de cada comida.`,
    benefits: [
      'Biodrenaje hepático y vesicular profundo',
      'Estimula la secreción biliar y digestión',
      'Coadyuvante en hígado graso, hepatitis y cirrosis',
      'Previene y ayuda en cálculos biliares',
      'Repara gastritis, úlceras y colitis',
      'Elimina acidez, reflujo y distensión abdominal',
      'Elimina boca amarga, gases y náuseas',
      'Desinflamante sistémico: próstata, ovarios y linfa',
    ],
    ingredients: ['Cúrcuma', 'Sangre de Drago', 'Moringa', 'Matico', 'Pimienta Negra'],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: '/images/pro-dhp.jpg',
    imagePlaceholder: '/images/pro-dhp.jpg',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_PRODHP',
    category: CATEGORIES.CELULAR,
    isFeatured: true,
    isHero: false,
    badge: '💚 Natural',
    stock: 'available',
    tags: ['hígado', 'digestivo', 'vesícula', 'gastritis', 'desintoxicación', 'natural'],
    whatsappMessage: 'Hola! Me interesa Pro DHP para la salud hepática y digestiva. ¿Me pueden dar más información?',
  },
  {
    id: 'prooxcell',
    slug: 'pro-oxcell',
    name: 'Pro Oxcell',
    tagline: 'Oxigenación Celular & Equilibrio del Sistema Nervioso',
    shortDescription: 'Fórmula natural con adaptógenos y extractos botánicos para calmar el sistema nervioso, mejorar el descanso y optimizar la oxigenación cerebral.',
    fullDescription: `Pro Oxcell es una exclusiva fórmula natural elaborada con extractos herbales de grado terapéutico que actúan en sinergia para estabilizar el sistema nervioso central, mejorar la microcirculación cerebral y restaurar el equilibrio emocional desde adentro.

A diferencia de los ansiolíticos sintéticos, Pro Oxcell no genera dependencia ni letargo, permitiéndote mantener tu productividad con una mente en paz. Ideal para quienes enfrentan altos niveles de estrés, tensión emocional o dificultades para descansar.

También es utilizado como coadyuvante en procesos relacionados con epilepsia y Parkinson, apoyando la protección neuronal y la microcirculación cerebral.

📌 Dosis recomendada: 10 a 25 gotas después de cada comida, según el nivel de tensión o necesidad de apoyo neurológico.`,
    benefits: [
      'Oxigenación cerebral y celular',
      'Calma el estrés y la ansiedad de forma natural',
      'Favorece el sueño profundo y reparador',
      'Alivia migrañas y dolores de cabeza tensionales',
      'Regula taquicardias y mareos de origen nervioso',
      'Reduce nerviosismo, irritabilidad y tensión emocional',
      'Sedante natural: sin dependencia ni efectos secundarios',
      'Coadyuvante en epilepsia y Parkinson',
    ],
    ingredients: ['Pasiflora', 'Toronjil', 'Valeriana', 'Maca', 'Romero', 'Ruda'],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: '/images/pro-oxcell.jpg',
    imagePlaceholder: '/images/pro-oxcell.jpg',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_PROOXCELL',
    category: CATEGORIES.CELULAR,
    isFeatured: true,
    isHero: false,
    badge: '🧠 Bienestar Mental',
    stock: 'available',
    tags: ['sistema nervioso', 'estrés', 'sueño', 'oxigenación', 'natural'],
    whatsappMessage: 'Hola! Me interesa Pro Oxcell para el bienestar del sistema nervioso. ¿Me pueden dar más información?',
  },
  {
    id: 'pc',
    slug: 'p-c',
    name: 'P-C',
    tagline: 'Potencia y Control',
    shortDescription: 'Suplemento natural para potencia y bienestar masculino con ingredientes activos.',
    fullDescription: `P-C es una formulación natural orientada al bienestar masculino integral. Contribuye a la vitalidad, equilibrio hormonal y calidad de vida general.`,
    benefits: [
      'Bienestar Masculino',
      'Equilibrio Hormonal Natural',
      'Vitalidad y Energía',
    ],
    ingredients: [],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: '/images/pro-c.jpg',
    imagePlaceholder: '/images/pro-c.jpg',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_PC',
    category: CATEGORIES.CELULAR,
    isFeatured: false,
    isHero: false,
    badge: null,
    stock: 'available',
    tags: ['bienestar', 'masculino', 'natural'],
    whatsappMessage: 'Hola! Me interesa el producto P-C, me pueden dar más información?',
  },
  {
    id: 'elixir',
    slug: 'elixir',
    name: 'Elixir',
    tagline: 'El Secreto de la Juventud',
    shortDescription: 'Elixir de vida para renovar y revitalizar tu organismo desde adentro.',
    fullDescription: `Elixir combina una selección de ingredientes botánicos y antioxidantes para promover la longevidad celular y el bienestar integral.`,
    benefits: [
      'Antienvejecimiento',
      'Renovación Celular',
      'Bienestar Integral',
    ],
    ingredients: [],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1/esplendor/elixir.webp',
    imagePlaceholder: '/images/placeholder-product.webp',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_ELIXIR',
    category: CATEGORIES.BEAUTY,
    isFeatured: false,
    isHero: false,
    badge: null,
    stock: 'available',
    tags: ['juventud', 'antioxidante', 'bienestar'],
    whatsappMessage: 'Hola! Me interesa el producto Elixir, me pueden dar más información?',
  },
  {
    id: 'keratina',
    slug: 'keratina',
    name: 'Keratina',
    tagline: 'Cabello Fuerte y Brillante',
    shortDescription: 'Fórmula especial de queratina para restaurar y fortalecer el cabello dañado.',
    fullDescription: `Keratina Natural repara el cabello desde adentro hacia afuera, sellando la cutícula capilar y restaurando el brillo y suavidad natural de cada hebra.`,
    benefits: [
      'Restaura el Cabello Dañado',
      'Sella la Cutícula Capilar',
      'Brillo y Suavidad Extrema',
      'Reduce el Frizz',
    ],
    ingredients: [],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1/esplendor/keratina.webp',
    imagePlaceholder: '/images/placeholder-product.webp',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_KERATINA',
    category: CATEGORIES.CAPILAR,
    isFeatured: false,
    isHero: false,
    badge: null,
    stock: 'available',
    tags: ['cabello', 'queratina', 'capilar'],
    whatsappMessage: 'Hola! Me interesa el producto Keratina, me pueden dar más información?',
  },
  {
    id: 'prodiureck',
    slug: 'pro-diureck',
    name: 'Pro Diureck',
    tagline: 'Biodrenante Renal & Depuración Natural',
    shortDescription: 'Fórmula con Cola de Caballo, Diente de León y Palo Azul para eliminar toxinas, reducir la retención de líquidos y apoyar el bienestar renal de forma natural.',
    fullDescription: `Pro Diureck es una exclusiva fórmula natural elaborada con extractos de plantas medicinales reconocidas por sus propiedades depurativas, diuréticas y antiinflamatorias, que trabajan en sinergia para optimizar la función renal y favorecer la eliminación de líquidos y toxinas acumuladas.

Favorece la depuración del organismo, reduce edemas y retención de agua, y modifica el pH urinario creando un ambiente menos propicio para infecciones y cistitis recurrentes. Es un aliado natural en procesos relacionados con cálculos renales, presión arterial y limpieza profunda del organismo.

Sus ingredientes como Ortiga Menor y Albahaca aportan acción antiinflamatoria y analgésica, protegiendo los riñones del daño oxidativo. Además, purifica el torrente sanguíneo de urea y creatinina, mejorando la vitalidad general y la respuesta inmunológica.

📌 Dosis recomendada: 20 a 50 gotas después de cada comida.`,
    benefits: [
      'Elimina toxinas y líquidos retenidos',
      'Favorece la depuración y limpieza renal',
      'Reduce edemas e inflamación',
      'Ayuda en cálculos renales y bienestar urinario',
      'Modifica el pH urinario: protege contra infecciones',
      'Colabora en la regulación de la presión arterial',
      'Purifica el organismo de urea y creatinina',
      'Protección antiinflamatoria y analgésica renal',
    ],
    ingredients: ['Albahaca', 'Apio', 'Lengua de Suegra', 'Cola de Caballo', 'Diente de León', 'Ortiga Menor', 'Palo Azul'],
    price: 140000,
    originalPrice: 160000,
    currency: 'COP',
    image: '/images/pro-diureck.jpg',
    imagePlaceholder: '/images/pro-diureck.jpg',
    gallery: [],
    woopinUrl: 'https://woopin.co/TU_LINK_PRODIURECK',
    category: CATEGORIES.RENAL,
    isFeatured: true,
    isHero: false,
    badge: '💧 Depurativo',
    stock: 'available',
    tags: ['renal', 'riñones', 'diurético', 'retención', 'depuración', 'natural'],
    whatsappMessage: 'Hola! Me interesa Pro Diureck para la salud renal y depuración. ¿Me pueden dar más información?',
  },
]

// Helpers
export const getFeaturedProducts = () => products.filter(p => p.isFeatured)
export const getHeroProduct = () => products.find(p => p.isHero)
export const getProductBySlug = (slug) => products.find(p => p.slug === slug)
export const getProductsByCategory = (category) => products.filter(p => p.category === category)

export const formatPrice = (price, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
