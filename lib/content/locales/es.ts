import type { ToolPageContent } from '../toolPage';

// Natively written for Spanish searchers (Latin America and Spain). Target phrases:
// "geoetiquetar fotos", "agregar ubicación a una foto", "añadir coordenadas GPS a fotos",
// "geolocalizar fotos online gratis", "editar datos EXIF", "Perfil de Empresa de Google".
const es: ToolPageContent = {
  metaTitle: 'Geoetiquetar fotos gratis: agregar ubicación GPS online',
  metaDescription:
    'Agrega ubicación a tus fotos gratis: coordenadas GPS, título y datos de tu negocio en JPG, PNG, WebP y HEIC. Sin registro. Ideal para tu Perfil de Empresa.',

  eyebrow: 'Gratis · Sin registro · Sin marca de agua',
  h1: 'Geoetiquetar fotos: agrega ubicación GPS a tus imágenes gratis',
  subtitle:
    'Elige un punto en el mapa, completa los datos de tu negocio y descarga tus fotos con las coordenadas GPS guardadas en los datos EXIF. Funciona con JPG, PNG, WebP, HEIC y más, hasta 10 fotos a la vez.',
  trustChips: ['100 % gratis', 'Hasta 10 fotos a la vez', 'No guardamos tus fotos', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Geoetiquetar mis fotos',
  ctaSecondary: 'Cómo funciona',

  stepsTitle: 'Cómo agregar ubicación a una foto en 4 pasos',
  stepsIntro: 'No necesitas Lightroom, ExifTool ni instalar ninguna app. Todo se hace en esta página.',
  steps: [
    { title: 'Sube tus fotos', desc: 'Arrastra hasta 10 imágenes o pega la URL de una página web para importar sus imágenes. Verás al instante los datos EXIF que ya tengan.' },
    { title: 'Marca la ubicación', desc: 'Busca una dirección, el nombre de un negocio o un lugar conocido, mueve el marcador en el mapa o escribe la latitud y la longitud.' },
    { title: 'Añade los datos de tu negocio', desc: 'Escribe título, descripción, palabras clave y nombre del negocio. La dirección, ciudad y código postal se rellenan solos a partir del mapa.' },
    { title: 'Aplica y descarga', desc: 'Elige el formato y la compresión, haz clic en aplicar y descarga cada foto o todas juntas en un ZIP.' },
  ],

  featuresTitle: 'Todo lo que necesitas para geolocalizar tus fotos',
  featuresIntro: 'Pensado para dueños de negocios, agencias de SEO e inmobiliarias que necesitan poner la ubicación en sus imágenes rápido.',
  features: [
    { title: 'Búsqueda en el mapa', desc: 'Encuentra cualquier calle, ciudad, lugar o negocio y ajusta el punto exacto arrastrando el marcador.' },
    { title: 'Coordenadas exactas', desc: 'Escribe la latitud y la longitud a mano cuando ya conoces la ubicación precisa.' },
    { title: 'Varias fotos a la vez', desc: 'Geoetiqueta hasta 10 fotos con la misma ubicación o cambia los datos de una sola imagen.' },
    { title: 'Metadatos para SEO local', desc: 'Guarda título, descripción, palabras clave y nombre del negocio en campos EXIF que muestran Windows y la mayoría de programas.' },
    { title: 'Convierte y comprime', desc: 'Exporta en JPG, PNG, WebP, AVIF o TIFF y reduce el peso para que tu web cargue más rápido.' },
    { title: 'Importa desde una URL', desc: 'Trae imágenes de una página pública o de un enlace directo sin tener que descargarlas antes.' },
    { title: 'Recorta y edita', desc: 'Recorta con una proporción fija o libre antes de geoetiquetar, para que la foto quede lista para publicar.' },
  ],

  metadataTitle: 'Qué datos EXIF se guardan en tu foto',
  metadataIntro: 'Geoetiquetar una foto significa guardar la ubicación dentro del propio archivo, en sus metadatos EXIF. Esto es exactamente lo que escribe PinPixl:',
  metadataHeaders: ['Dato', 'Campo EXIF', 'Ejemplo'],
  metadataRows: [
    { field: 'Ubicación GPS', example: '19.4326° N, 99.1332° O' },
    { field: 'Título', example: 'Pan dulce recién horneado en nuestra panadería de la Roma' },
    { field: 'Descripción', example: 'Conchas saliendo del horno en Ciudad de México.' },
    { field: 'Palabras clave', example: 'panadería, pan dulce, CDMX' },
    { field: 'Nombre del negocio', example: 'Nombre de tu negocio' },
    { field: 'Ciudad, país y más', example: 'City: Ciudad de México; Country: México' },
    { field: 'Fecha de captura, cámara', example: '2026:11:18 08:30:00' },
  ],
  metadataNote: 'JPG da los resultados más fiables. Los demás formatos se convierten, y que se conserven todos los campos depende de la plataforma donde subas la imagen.',

  useCasesTitle: '¿Quién necesita geoetiquetar fotos?',
  useCases: [
    { title: 'Negocios con Perfil de Empresa de Google', desc: 'Prepara fotos del local, del equipo y de tus trabajos con datos de ubicación coherentes antes de publicarlas.' },
    { title: 'Agencias de SEO y marketing', desc: 'Geoetiqueta fotos de clientes por lotes con el nombre, las palabras clave y la dirección de cada sucursal.' },
    { title: 'Inmobiliarias', desc: 'Registra dónde se tomó cada foto de una propiedad para mantener ordenados anuncios y archivos.' },
    { title: 'Contratistas y servicios a domicilio', desc: 'Demuestra dónde hiciste cada trabajo: las fotos de antes y después llevan la ubicación de la obra.' },
    { title: 'Fotógrafos y viajeros', desc: 'Añade ubicación a fotos de cámaras sin GPS para verlas en el mapa de Google Fotos, Apple Fotos o Lightroom.' },
    { title: 'Dueños de sitios web', desc: 'Comprime y convierte imágenes para que tu web cargue rápido sin perder metadatos útiles.' },
  ],

  seoTitle: '¿Geoetiquetar fotos ayuda al SEO local? La respuesta honesta',
  seoParagraphs: [
    'Muchos venden la geoetiqueta como un truco para posicionar. No lo es. Google nunca ha confirmado que los datos GPS de una imagen sean un factor de posicionamiento, y las fotos del Perfil de Empresa de Google pierden sus datos EXIF al publicarse.',
    '¿Entonces para qué sirve? Para mantener ordenada tu biblioteca de imágenes, para que las apps de fotos y los mapas ubiquen bien tus imágenes y para sumar un dato de ubicación coherente a los archivos que publicas en tu web y en directorios. Es una buena práctica que acompaña tu SEO local, no un sustituto.',
    'Lo que sí cuenta para la búsqueda local es lo que ven las personas y Google: fotos reales de tu negocio, nombres de archivo descriptivos, un texto alternativo útil y el mismo nombre, dirección y teléfono en todas partes.',
  ],
  seoChecklistTitle: 'Checklist de SEO local para imágenes',
  seoChecklist: [
    'Usa fotos reales de tu local, tu equipo y tus trabajos. Evita las fotos de banco.',
    'Nombra los archivos con lo que muestran, por ejemplo panaderia-roma-cdmx.jpg en lugar de IMG_4521.jpg.',
    'Escribe un texto alternativo que describa la imagen, no una lista de palabras clave.',
    'Comprime las imágenes para que la página cargue rápido en el celular.',
    'Publica fotos nuevas en tu Perfil de Empresa de Google con regularidad.',
    'Mantén idénticos el nombre, la dirección y el teléfono en tu web y en todos los directorios.',
  ],

  privacyTitle: 'Qué hacemos con tus fotos',
  privacyParagraphs: [
    'Para escribir los metadatos y convertir formatos, tu foto se envía por una conexión cifrada a nuestro servidor, se procesa en memoria y se te devuelve como descarga. No guardamos tus fotos, no conservamos copias y no las usamos para nada más.',
    'No hay cuentas, así que nada vincula tus fotos contigo. La búsqueda de ubicaciones usa datos de mapas públicos.',
  ],

  formatsTitle: 'Formatos de imagen compatibles',
  formats: [
    { format: 'JPG / JPEG', support: 'Total', note: 'La mejor opción. GPS y todos los campos de texto funcionan en cualquier plataforma.' },
    { format: 'PNG', support: 'Buena', note: 'Se guarda el GPS, pero algunas webs y apps ignoran los metadatos PNG.' },
    { format: 'WebP', support: 'Buena', note: 'Archivos ligeros para la web. La lectura de metadatos depende de la plataforma.' },
    { format: 'HEIC / HEIF', support: 'Convertido', note: 'Fotos de iPhone. Expórtalas a JPG para la máxima compatibilidad.' },
    { format: 'AVIF, TIFF', support: 'Convertido', note: 'Se aceptan y exportan. Comprueba que tu plataforma lea los metadatos.' },
  ],

  faqTitle: 'Preguntas frecuentes sobre geoetiquetar fotos',
  faqSubtitle: 'Dudas comunes sobre ubicación GPS, datos EXIF y metadatos de imágenes.',
  faqs: [
    { q: '¿Cómo agrego la ubicación a una foto?', a: 'Sube la foto arriba, busca la dirección o mueve el marcador en el mapa y haz clic en aplicar. La herramienta guarda las coordenadas en los datos EXIF y descargas la foto geoetiquetada. Tarda menos de un minuto y no necesitas instalar nada.' },
    { q: '¿Es realmente gratis?', a: 'Sí. No hay registro, ni marca de agua, ni plan de pago. Puedes geoetiquetar hasta 10 fotos por tanda, de hasta 10 MB cada una.' },
    { q: '¿Geoetiquetar fotos mejora mi posicionamiento en Google?', a: 'No de forma directa. Google no ha confirmado los datos GPS de las imágenes como factor de posicionamiento, y el Perfil de Empresa de Google elimina los datos EXIF de las fotos publicadas. Sirve para ordenar imágenes y mantener datos coherentes, pero pesan más las fotos reales, los buenos nombres de archivo y el texto alternativo.' },
    { q: '¿Debo geoetiquetar las fotos antes de subirlas a mi Perfil de Empresa de Google?', a: 'No hace daño y mantiene ordenados tus archivos originales, pero no esperes que por sí solo mejore tu posición. Enfócate en subir fotos reales, recientes y de buena calidad con frecuencia.' },
    { q: '¿Cómo edito los datos EXIF de una foto online?', a: 'Con PinPixl puedes cambiar la ubicación GPS, el título, la descripción, las palabras clave, el nombre del negocio, la fecha y la cámara desde el formulario y descargar el archivo con los nuevos datos EXIF, sin instalar programas.' },
    { q: '¿Guardan mis fotos?', a: 'No. Las fotos se procesan en la memoria de nuestro servidor solo para escribir los metadatos y convertir el formato, y luego se te devuelven. No se guardan ni se comparten.' },
    { q: '¿Cómo sé si una foto tiene ubicación GPS?', a: 'Súbela a la herramienta y verás sus metadatos al instante. En Windows, haz clic derecho en el archivo, Propiedades y luego Detalles. En Mac, ábrela en Vista Previa y elige Herramientas › Mostrar inspector.' },
    { q: '¿Puedo geoetiquetar fotos HEIC del iPhone?', a: 'Sí. Aceptamos HEIC y HEIF. Para la mejor compatibilidad, expórtalas a JPG.' },
    { q: '¿Puedo geoetiquetar varias fotos a la vez?', a: 'Sí. Sube hasta 10 fotos, marca una ubicación, aplícala a todas y descárgalas juntas en un ZIP. Aun así puedes editar los datos de cada foto por separado.' },
    { q: '¿Se pierde calidad al geoetiquetar?', a: 'No, a menos que elijas compresión o cambies el formato. Con la compresión en Ninguna y el formato original, solo cambian los metadatos.' },
  ],

  finalCtaTitle: '¿Listo para geoetiquetar tus fotos?',
  finalCtaText: 'Gratis, sin registro y en menos de un minuto.',
  finalCtaButton: 'Empezar ahora',
};

export default es;
