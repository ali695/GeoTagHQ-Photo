import type { ToolPageContent } from '../toolPage';

// Natively written for French searchers. Target phrases:
// "géolocaliser une photo", "ajouter des coordonnées GPS à une photo", "géotaguer des photos",
// "ajouter une localisation à une photo", "modifier les données EXIF", "fiche d'établissement Google".
const fr: ToolPageContent = {
  metaTitle: 'Géolocaliser une photo : ajouter des coordonnées GPS en ligne',
  metaDescription:
    "Géolocalisez vos photos gratuitement : coordonnées GPS, titre et infos d'entreprise dans vos JPG, PNG, WebP et HEIC. Sans inscription, sans filigrane.",

  eyebrow: 'Gratuit · Sans inscription · Sans filigrane',
  h1: 'Géolocaliser une photo : ajoutez des coordonnées GPS gratuitement',
  subtitle:
    "Choisissez un lieu sur la carte, renseignez les informations de votre entreprise et téléchargez vos photos avec les coordonnées GPS inscrites dans les données EXIF. JPG, PNG, WebP, HEIC et plus, jusqu'à 10 photos à la fois.",
  trustChips: ['100 % gratuit', "Jusqu'à 10 photos à la fois", 'Photos jamais conservées', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Géolocaliser mes photos',
  ctaSecondary: 'Comment ça marche',

  stepsTitle: 'Comment ajouter des coordonnées GPS à une photo en 4 étapes',
  stepsIntro: "Pas besoin de Lightroom, d'ExifTool ni d'application. Tout se fait sur cette page.",
  steps: [
    { title: 'Importez vos photos', desc: "Glissez jusqu'à 10 images ou collez l'adresse d'une page web pour récupérer ses images. Les données EXIF existantes s'affichent tout de suite." },
    { title: "Placez l'emplacement", desc: "Recherchez une adresse, un commerce ou un monument, déplacez le repère sur la carte ou saisissez la latitude et la longitude." },
    { title: 'Ajoutez vos infos locales', desc: "Indiquez titre, description, mots-clés et nom de l'entreprise. L'adresse, la ville et le code postal se remplissent automatiquement depuis la carte." },
    { title: 'Appliquez et téléchargez', desc: 'Choisissez le format et la compression, cliquez sur appliquer et téléchargez chaque photo ou toutes en un fichier ZIP.' },
  ],

  featuresTitle: 'Tout ce qu’il faut pour géotaguer vos images',
  featuresIntro: 'Conçu pour les commerçants, artisans, agences SEO et photographes qui veulent ajouter une localisation à leurs images rapidement.',
  features: [
    { title: 'Recherche sur la carte', desc: 'Trouvez une rue, une ville, un lieu ou une entreprise, puis ajustez le point exact en déplaçant le repère.' },
    { title: 'Coordonnées précises', desc: 'Saisissez la latitude et la longitude à la main quand vous connaissez déjà l’emplacement.' },
    { title: 'Plusieurs photos en une fois', desc: "Géolocalisez jusqu'à 10 photos au même endroit ou modifiez les métadonnées d'une seule image." },
    { title: 'Métadonnées pour le SEO local', desc: "Inscrivez titre, description, mots-clés et nom de l'entreprise dans des champs EXIF lus par Windows et la plupart des logiciels photo." },
    { title: 'Convertir et compresser', desc: 'Exportez en JPG, PNG, WebP, AVIF ou TIFF et allégez vos fichiers pour un site plus rapide.' },
    { title: 'Importer depuis une URL', desc: "Récupérez les images d'une page publique ou d'un lien direct sans les télécharger au préalable." },
    { title: 'Recadrer et retoucher', desc: 'Recadrez selon un format prédéfini ou librement avant de géolocaliser la photo.' },
  ],

  metadataTitle: 'Les données EXIF inscrites dans votre photo',
  metadataIntro: "Géolocaliser une photo, c'est enregistrer un emplacement dans le fichier lui-même, dans ses métadonnées EXIF. Voici précisément ce qu’écrit PinPixl :",
  metadataHeaders: ['Information', 'Champ EXIF', 'Exemple'],
  metadataRows: [
    { field: 'Position GPS', example: '45.7640° N, 4.8357° E' },
    { field: 'Titre', example: 'Pain au levain de notre boulangerie à Lyon' },
    { field: 'Description', example: 'La fournée du matin dans notre boutique de la Croix-Rousse.' },
    { field: 'Mots-clés', example: 'boulangerie, pain au levain, Lyon' },
    { field: "Nom de l'entreprise", example: 'Le nom de votre entreprise' },
    { field: 'Ville, pays et plus', example: 'City: Lyon; Country: France' },
    { field: 'Date de prise de vue, appareil', example: '2026:11:18 07:30:00' },
  ],
  metadataNote: "Le JPG donne les résultats les plus fiables. Les autres formats sont convertis, et la prise en charge de certains champs dépend de la plateforme où vous publiez l'image.",

  useCasesTitle: 'Qui a besoin de géolocaliser ses photos ?',
  useCases: [
    { title: "Commerces avec une fiche d'établissement Google", desc: 'Préparez vos photos de vitrine, d’équipe et de réalisations avec des informations de lieu cohérentes avant de les publier.' },
    { title: 'Agences SEO et marketing', desc: 'Géolocalisez les photos de vos clients par lots, avec le bon nom, les bons mots-clés et l’adresse de chaque établissement.' },
    { title: 'Agents immobiliers', desc: 'Gardez la trace du lieu de chaque photo de bien pour des annonces et des archives bien rangées.' },
    { title: 'Artisans et entreprises du bâtiment', desc: 'Prouvez où un chantier a été réalisé : les photos avant/après portent la localisation du chantier.' },
    { title: 'Photographes et voyageurs', desc: 'Ajoutez un lieu aux photos d’appareils sans GPS pour les retrouver sur la carte dans Google Photos, Apple Photos ou Lightroom.' },
    { title: 'Propriétaires de sites web', desc: 'Compressez et convertissez vos images pour accélérer vos pages sans perdre de métadonnées utiles.' },
  ],

  seoTitle: 'Géolocaliser ses photos aide-t-il le référencement local ? La réponse honnête',
  seoParagraphs: [
    "Le géotag est souvent vendu comme une astuce de référencement. Ce n'en est pas une. Google n'a jamais confirmé que les données GPS d'une image comptent dans le classement, et les photos publiées sur une fiche d'établissement Google perdent leurs données EXIF.",
    "Alors pourquoi géolocaliser ? Parce que la localisation garde votre photothèque organisée, aide les applis photo et les cartes à placer correctement vos images, et ajoute une information de lieu cohérente aux fichiers publiés sur votre site et dans les annuaires. C'est une bonne pratique qui accompagne votre SEO local, pas un remplacement.",
    "Ce qui compte vraiment pour la recherche locale, c'est ce que les internautes et Google voient : de vraies photos de votre établissement, des noms de fichiers parlants, un texte alternatif utile et des nom, adresse et téléphone identiques partout.",
  ],
  seoChecklistTitle: 'Checklist SEO local pour vos images',
  seoChecklist: [
    'Utilisez de vraies photos de vos locaux, de votre équipe et de vos réalisations, pas des images de banque.',
    'Nommez vos fichiers de façon descriptive, par exemple boulangerie-lyon-levain.jpg plutôt que IMG_4521.jpg.',
    "Rédigez un texte alternatif qui décrit l'image, pas une liste de mots-clés.",
    'Compressez vos images pour un chargement rapide sur mobile.',
    "Publiez régulièrement de nouvelles photos sur votre fiche d'établissement Google.",
    'Gardez un nom, une adresse et un téléphone identiques sur votre site et dans tous les annuaires.',
  ],

  privacyTitle: 'Ce que nous faisons de vos photos',
  privacyParagraphs: [
    "Pour écrire les métadonnées et convertir les formats, votre photo est envoyée via une connexion chiffrée à notre serveur, traitée en mémoire puis renvoyée en téléchargement. Nous n'enregistrons pas vos photos, n'en gardons aucune copie et ne les utilisons pour rien d'autre.",
    "Il n'y a pas de compte : rien ne relie vos photos à vous. La recherche de lieux utilise des données cartographiques publiques.",
  ],

  formatsTitle: "Formats d'image pris en charge",
  formats: [
    { format: 'JPG / JPEG', support: 'Complet', note: 'Le meilleur choix. Le GPS et tous les champs texte sont lus partout.' },
    { format: 'PNG', support: 'Bon', note: 'Le GPS est inscrit, mais certains sites et applis ignorent les métadonnées PNG.' },
    { format: 'WebP', support: 'Bon', note: 'Fichiers légers pour le web. La lecture des métadonnées varie selon la plateforme.' },
    { format: 'HEIC / HEIF', support: 'Converti', note: "Photos d'iPhone. Exportez en JPG pour une compatibilité maximale." },
    { format: 'AVIF, TIFF', support: 'Converti', note: 'Acceptés et exportés. Vérifiez que votre plateforme lit les métadonnées.' },
  ],

  faqTitle: 'Questions fréquentes sur la géolocalisation de photos',
  faqSubtitle: 'Les réponses aux questions courantes sur le GPS, les données EXIF et les métadonnées.',
  faqs: [
    { q: 'Comment ajouter des coordonnées GPS à une photo ?', a: "Importez la photo ci-dessus, recherchez l'adresse ou déplacez le repère sur la carte, puis cliquez sur appliquer. L'outil inscrit les coordonnées dans les données EXIF et vous téléchargez la photo géolocalisée. Moins d'une minute, sans logiciel." },
    { q: "L'outil est-il vraiment gratuit ?", a: "Oui. Pas d'inscription, pas de filigrane, pas d'offre payante. Vous pouvez traiter jusqu'à 10 photos par lot, de 10 Mo maximum chacune." },
    { q: 'Géolocaliser mes photos améliore-t-il mon classement Google ?', a: "Pas directement. Google n'a pas confirmé que les données GPS des images sont un critère de classement, et la fiche d'établissement Google supprime les données EXIF des photos publiées. C'est utile pour organiser vos images et garder des infos cohérentes, mais de vraies photos, de bons noms de fichiers et un texte alternatif comptent davantage." },
    { q: "Faut-il géolocaliser ses photos avant de les publier sur sa fiche d'établissement Google ?", a: "Cela ne fait pas de mal et garde vos fichiers d'origine bien organisés, mais n'en attendez pas un gain de classement à lui seul. Publiez surtout régulièrement de vraies photos récentes et de qualité." },
    { q: 'Comment modifier les données EXIF d’une photo en ligne ?', a: "PinPixl permet de modifier la position GPS, le titre, la description, les mots-clés, le nom de l'entreprise, la date et l'appareil depuis le formulaire, puis de télécharger le fichier avec ses nouvelles données EXIF, sans rien installer." },
    { q: 'Conservez-vous mes photos ?', a: 'Non. Vos photos sont traitées en mémoire sur notre serveur uniquement pour écrire les métadonnées et convertir le format, puis vous sont renvoyées. Elles ne sont ni enregistrées ni partagées.' },
    { q: 'Comment savoir si une photo contient des données GPS ?', a: "Importez-la dans l'outil : ses métadonnées s'affichent aussitôt. Sous Windows, clic droit sur le fichier, Propriétés puis Détails. Sur Mac, ouvrez-la dans Aperçu et choisissez Outils › Afficher l'inspecteur." },
    { q: "Peut-on géolocaliser des photos HEIC d'iPhone ?", a: 'Oui, les fichiers HEIC et HEIF sont acceptés. Pour une compatibilité maximale, exportez-les en JPG.' },
    { q: 'Peut-on géolocaliser plusieurs photos à la fois ?', a: "Oui. Importez jusqu'à 10 photos, placez un emplacement, appliquez-le à toutes et téléchargez-les ensemble en ZIP. Vous pouvez toujours modifier une photo à part." },
    { q: 'La géolocalisation réduit-elle la qualité de la photo ?', a: "Non, sauf si vous choisissez une compression ou un autre format. Avec la compression sur Aucune et le format d'origine, seules les métadonnées changent." },
  ],

  finalCtaTitle: 'Prêt à géolocaliser vos photos ?',
  finalCtaText: "Gratuit, sans inscription, et fait en moins d'une minute.",
  finalCtaButton: 'Commencer',
};

export default fr;
