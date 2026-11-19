import type { ToolExtras } from '../types';

// Spanish long-form sections (Latin America and Spain), written natively.
const es: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: '¿Qué son los datos EXIF?',
        paragraphs: [
          'EXIF viene de “Exchangeable Image File Format”. Cada vez que tomas una foto, tu cámara o tu celular guarda dentro del archivo información que no se ve: el modelo del equipo, la lente, la apertura, la velocidad, el ISO, la fecha y la hora… y, si tienes la ubicación activada, las coordenadas GPS exactas.',
          'A eso se suman los datos XMP e IPTC que añaden programas como Lightroom o Photoshop: título, descripción, palabras clave, autor y derechos de autor. El visor te muestra todo de una vez, no solo los cuatro datos que enseña Windows en “Propiedades”.',
        ],
      },
      {
        title: 'Por qué algunas fotos no tienen metadatos',
        paragraphs: [
          'Cuando subes una foto a WhatsApp, Facebook, Instagram o X, casi siempre se borran los metadatos para proteger tu privacidad y ahorrar espacio. Por eso una imagen que guardas desde un chat normalmente ya no tiene ni datos de la cámara ni ubicación.',
          'Las capturas de pantalla, los documentos escaneados y muchas imágenes editadas tampoco suelen traer EXIF. Si quieres saber qué guarda realmente una foto, usa siempre el archivo original del celular o de la cámara.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: '¿Qué tan exacta es la ubicación de una foto?',
        paragraphs: [
          'La herramienta lee las coordenadas GPS que guardó tu teléfono al tomar la foto; no adivina el lugar por lo que se ve en la imagen. Al aire libre, el punto guardado suele quedar a entre 5 y 20 metros del lugar real.',
          'En interiores, en calles con edificios altos o justo después de encender el teléfono, el margen puede ser mayor porque la señal GPS es débil o rebota. Con la vista satélite puedes comprobar rápido si el punto tiene sentido.',
        ],
      },
      {
        title: 'Cuida tu propia ubicación',
        paragraphs: [
          'Lo que sirve para descubrir dónde se tomó una foto ajena puede jugar en tu contra: quien recibe una foto original tuya por correo, enlace de la nube o AirDrop podría ver exactamente dónde vives o a qué escuela van tus hijos.',
          'Antes de vender algo en Mercado Libre o Marketplace, o de publicar fotos de tu casa, quita la ubicación con nuestra herramienta “Quitar datos EXIF”. Toma unos segundos.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Sin pérdida: la imagen queda intacta',
        paragraphs: [
          'Muchas herramientas en línea vuelven a guardar la imagen completa, y cada vez pierde un poco de calidad. Con JPG, PNG y WebP nosotros solo recortamos los bloques de metadatos del archivo; los datos de la imagen quedan exactamente iguales.',
          'Hay dos excepciones: las fotos que dependen de la etiqueta de orientación se guardan ya derechas (si no, quedarían de lado al quitar la etiqueta), y las fotos HEIC del iPhone se guardan como JPG porque los navegadores no pueden escribir HEIC.',
        ],
      },
      {
        title: 'Qué se elimina exactamente',
        bullets: [
          'EXIF: ubicación GPS, modelo de cámara, lente, ajustes de la toma, fechas, software, números de serie y miniatura.',
          'XMP: historial de edición, calificaciones, palabras clave y datos de ubicación de programas como Lightroom.',
          'IPTC: pie de foto, autor, derechos de autor y datos de contacto.',
          'Comentarios y fragmentos de texto en archivos PNG.',
          'Se conserva el perfil de color (ICC) para que los colores se vean igual que antes.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Latitud y longitud, explicadas fácil',
        paragraphs: [
          'La latitud indica qué tan al norte o al sur del ecuador está un lugar (de −90° a +90°). La longitud indica qué tan al este o al oeste del meridiano de Greenwich está (de −180° a +180°). Juntas forman las coordenadas geográficas de cualquier punto.',
          'Hay dos formas habituales de escribirlas: en grados decimales, como 19.432608, -99.133209, que es lo que usan Google Maps y casi todas las apps, y en grados, minutos y segundos, como 19°25\'57.4" N 99°07\'59.6" W, típico de mapas en papel y navegación.',
        ],
      },
      {
        title: 'Para qué sirven las coordenadas',
        bullets: [
          'Poner la ubicación exacta en tu Perfil de Empresa de Google, directorios o apps de reparto.',
          'Mandar a clientes o técnicos un punto de encuentro o una obra sin número.',
          'Geoetiquetar fotos: copia las coordenadas y pégalas en nuestra herramienta de geoetiquetado.',
          'Ver dónde queda exactamente un punto que te enviaron por WhatsApp.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: '¿Por qué comprimir imágenes?',
        bullets: [
          'Las imágenes suelen ser lo que más pesa en una página web. Archivos más ligeros cargan más rápido y mejoran las Core Web Vitals.',
          'Muchos correos y formularios limitan el tamaño de los archivos adjuntos.',
          'Tiendas en línea, marketplaces y el Perfil de Empresa de Google procesan más rápido las imágenes ligeras.',
          'Ahorras espacio y tus visitantes gastan menos datos móviles.',
        ],
      },
      {
        title: 'Cómo funciona la compresión de PNG',
        paragraphs: [
          'El PNG es sin pérdida, así que el navegador casi no puede reducirlo. Si mantienes el formato PNG, nuestro servidor lo convierte a una paleta de colores optimizada, la misma técnica que usan los compresores de PNG más conocidos. Normalmente baja entre un 60 y un 80 % con una diferencia casi imperceptible.',
          'El archivo se procesa solo en memoria y no se guarda. Si prefieres que nada salga de tu equipo, elige WebP como formato de salida: se hace todo en el navegador y suele quedar todavía más ligero.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'Cómo hacer que tu iPhone guarde fotos en JPG',
        paragraphs: [
          'Si prefieres que tu iPhone tome fotos en JPG desde el principio, entra en Ajustes › Cámara › Formatos y elige “Más compatible”. Las fotos nuevas se guardarán en JPG; las que ya tienes seguirán en HEIC, y para eso está este conversor.',
          'Ojo: al enviar fotos por AirDrop o correo, iOS muchas veces las convierte solo a JPG. En cambio, si las pasas por cable a una PC con Windows o desde iCloud para Windows, se quedan en HEIC.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Consejos para las imágenes de tu sitio web',
        bullets: [
          'Primero reduce el tamaño y después convierte: una foto de 4000 píxeles que se muestra a 1200 desperdicia datos. Usa la opción “Redimensionar”.',
          'Una calidad de 80–85 % es un buen equilibrio para fotos en la web.',
          'Guarda el original si también vas a usar la imagen para imprimir o enviar por correo.',
          'WordPress, Shopify, Wix y Tiendanube aceptan imágenes WebP.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Bueno saberlo',
        paragraphs: [
          `Convertir no recupera detalles que la imagen ${c.F} ya no tiene. Por eso conviene guardar siempre el archivo original y volver a convertir desde ahí cuando lo necesites.`,
          'Todas las conversiones se hacen en tu navegador, también en el celular. Con muchos archivos grandes, los equipos más viejos pueden tardar un poco; en ese caso conviértelos en grupos más pequeños.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Conversiones más buscadas',
      paragraphs: [
        'Cada conversión popular tiene su propia página con consejos: HEIC a JPG para fotos del iPhone, WebP a JPG para imágenes descargadas de internet, JPG a WebP para que tu web cargue más rápido, PNG a JPG para archivos más ligeros y SVG a PNG para logotipos. Las encuentras abajo en “Más herramientas gratis”.',
      ],
    },
  ],
};

export default es;
