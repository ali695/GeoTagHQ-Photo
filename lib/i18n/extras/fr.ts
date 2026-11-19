import type { ToolExtras } from '../types';

// French long-form sections, written natively.
const fr: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'Les données EXIF, c’est quoi exactement ?',
        paragraphs: [
          'EXIF signifie « Exchangeable Image File Format ». À chaque déclenchement, votre appareil photo ou votre smartphone glisse dans le fichier des informations invisibles : modèle, objectif, ouverture, vitesse, ISO, date et heure… et, si la localisation est activée, les coordonnées GPS précises.',
          'S’y ajoutent souvent des données XMP et IPTC laissées par Lightroom, Photoshop ou d’autres logiciels : titre, légende, mots-clés, auteur et copyright. La visionneuse vous montre tout d’un coup d’œil, bien au-delà des quelques champs affichés par Windows dans « Propriétés ».',
        ],
      },
      {
        title: 'Pourquoi certaines photos n’ont aucune métadonnée',
        paragraphs: [
          'Dès que vous publiez une photo sur WhatsApp, Facebook, Instagram ou X, les métadonnées sont presque toujours supprimées, par respect de la vie privée et pour gagner de la place. Une image enregistrée depuis une conversation n’a donc généralement plus ni infos d’appareil ni lieu.',
          'Les captures d’écran, les documents scannés et beaucoup d’images retouchées en contiennent aussi très peu. Pour savoir ce que cache vraiment une photo, utilisez toujours le fichier d’origine du téléphone ou de l’appareil.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Quelle précision pour le lieu d’une photo ?',
        paragraphs: [
          'L’outil lit les coordonnées GPS enregistrées par votre téléphone au moment de la prise de vue ; il ne devine pas le lieu à partir de ce qu’on voit sur l’image. En extérieur, le point enregistré se trouve en général à 5 à 20 mètres de la position réelle.',
          'À l’intérieur, dans les rues étroites bordées d’immeubles ou juste après avoir allumé le téléphone, l’écart peut être plus grand, car le signal GPS est faible ou rebondit. La vue satellite permet de vérifier rapidement si le point est cohérent.',
        ],
      },
      {
        title: 'Protégez votre propre localisation',
        paragraphs: [
          'Ce qui est pratique pour retrouver le lieu d’une photo l’est aussi pour les autres : quelqu’un qui reçoit vos photos originales par e-mail, lien cloud ou AirDrop peut parfois voir précisément où vous habitez ou l’école de vos enfants.',
          'Avant de publier une annonce sur Leboncoin ou Vinted, ou de partager des photos de chez vous, supprimez la localisation avec notre outil « Supprimer les données EXIF ». C’est l’affaire de quelques secondes.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Sans perte : l’image elle-même n’est pas touchée',
        paragraphs: [
          'Beaucoup d’outils en ligne réenregistrent toute l’image, qui perd un peu en qualité à chaque passage. Pour les JPG, PNG et WebP, nous retirons uniquement les blocs de métadonnées du fichier : les données de l’image restent identiques, octet pour octet.',
          'Deux exceptions : les photos qui ne s’affichent à l’endroit que grâce à la balise d’orientation sont réenregistrées droites (sinon elles apparaîtraient couchées), et les photos HEIC d’iPhone sont enregistrées en JPG, car les navigateurs ne savent pas écrire le HEIC.',
        ],
      },
      {
        title: 'Ce qui est supprimé',
        bullets: [
          'EXIF : position GPS, modèle d’appareil, objectif, réglages, dates, logiciel, numéros de série et vignette.',
          'XMP : historique de retouche, notes, mots-clés et données de lieu ajoutées par Lightroom et autres.',
          'IPTC : légende, auteur, copyright et coordonnées de contact.',
          'Commentaires et blocs de texte des fichiers PNG.',
          'Conservé : le profil colorimétrique (ICC), pour que les couleurs restent identiques.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Latitude et longitude, simplement',
        paragraphs: [
          'La latitude indique à quelle distance un lieu se trouve au nord ou au sud de l’équateur (de −90° à +90°). La longitude indique sa position à l’est ou à l’ouest du méridien de Greenwich (de −180° à +180°). Ensemble, elles forment les coordonnées GPS d’un point.',
          'On les écrit de deux façons : en degrés décimaux, comme 48.856613, 2.352222, le format de Google Maps et de la plupart des applis, ou en degrés, minutes, secondes, comme 48°51\'23.8" N 2°21\'08.0" E, que l’on retrouve sur les cartes IGN et en navigation.',
        ],
      },
      {
        title: 'À quoi servent les coordonnées GPS',
        bullets: [
          'Indiquer l’emplacement exact sur votre fiche d’établissement Google, un annuaire ou une appli de livraison.',
          'Envoyer à un client ou un artisan un point de rendez-vous ou un chantier sans numéro de rue.',
          'Géolocaliser des photos : copiez les coordonnées et collez-les dans notre outil de géolocalisation.',
          'Vérifier où se trouvent des coordonnées qu’on vous a envoyées.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Pourquoi compresser vos images ?',
        bullets: [
          'Les images sont souvent ce qui pèse le plus sur une page web. Plus légères, elles s’affichent plus vite et améliorent les Core Web Vitals.',
          'Beaucoup de messageries et de formulaires limitent la taille des pièces jointes.',
          'Boutiques en ligne, sites d’annonces et fiche d’établissement Google traitent plus vite les images légères.',
          'Vous gagnez de l’espace de stockage et vos visiteurs consomment moins de data.',
        ],
      },
      {
        title: 'Comment fonctionne la compression PNG',
        paragraphs: [
          'Le PNG est sans perte : un navigateur ne peut presque pas l’alléger. Si vous gardez le format PNG, notre serveur le réduit à une palette de couleurs optimisée, la même technique que les compresseurs PNG les plus connus. Le gain atteint souvent 60 à 80 % pour une différence à peine visible.',
          'Le fichier est traité en mémoire uniquement, sans être conservé. Pour que rien ne quitte votre appareil, choisissez plutôt WebP en sortie : tout se fait dans le navigateur et le fichier est souvent encore plus léger.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'Faire enregistrer vos photos en JPG par l’iPhone',
        paragraphs: [
          'Si vous préférez des photos en JPG dès le départ, allez dans Réglages › Appareil photo › Formats et choisissez « Le plus compatible ». Les nouvelles photos seront en JPG ; les anciennes restent en HEIC, et c’est là que ce convertisseur sert.',
          'Bon à savoir : en partageant par AirDrop ou par e-mail, iOS convertit souvent les photos en JPG automatiquement. En revanche, copiées par câble sur un PC Windows ou via iCloud pour Windows, elles restent en HEIC.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Conseils pour les images de votre site',
        bullets: [
          'Redimensionnez avant de convertir : une photo de 4000 pixels affichée en 1200 gaspille de la bande passante. Utilisez l’option « Redimensionner ».',
          'Une qualité de 80 à 85 % est un bon compromis pour les photos sur le web.',
          'Gardez l’original si vous avez aussi besoin de l’image pour l’impression ou l’e-mail.',
          'WordPress, Shopify, Wix et PrestaShop acceptent les images WebP.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'À savoir',
        paragraphs: [
          `Une conversion ne peut pas recréer des détails absents de l’image ${c.F}. Conservez toujours le fichier d’origine et repartez de lui si vous devez reconvertir.`,
          'Toutes les conversions se font dans votre navigateur, y compris sur mobile. Avec beaucoup de gros fichiers, un appareil ancien peut mettre un peu de temps : convertissez alors par petits lots.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Les conversions les plus demandées',
      paragraphs: [
        'Chaque conversion courante a sa propre page avec des conseils adaptés : HEIC en JPG pour les photos d’iPhone, WebP en JPG pour les images récupérées sur internet, JPG en WebP pour un site plus rapide, PNG en JPG pour des fichiers plus légers et SVG en PNG pour les logos. Retrouvez-les plus bas dans « Autres outils gratuits ».',
      ],
    },
  ],
};

export default fr;
