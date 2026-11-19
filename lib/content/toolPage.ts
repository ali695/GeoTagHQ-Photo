// Page copy for the Free Geo Tagging Tool landing page.
// English lives here. Each other language has its own natively written page in
// lib/content/locales/<lang>.ts, built around the phrases people search for in
// that language (not a translation of the English page).

import { LOCALE_PAGES } from './locales';

export type Faq = { q: string; a: string };

export type ToolPageContent = {
  /** Used for <title> and og:title. Falls back to messages/<lang>.json. */
  metaTitle?: string;
  /** Used for the meta description. Falls back to messages/<lang>.json. */
  metaDescription?: string;

  eyebrow?: string;
  h1: string;
  subtitle: string;
  trustChips?: string[];
  ctaPrimary?: string;
  ctaSecondary?: string;

  stepsTitle: string;
  stepsIntro?: string;
  steps: { title: string; desc: string }[];

  featuresTitle?: string;
  featuresIntro?: string;
  /** `icon` defaults to FEATURE_ICON_ORDER[index]. */
  features?: { icon?: FeatureIcon; title: string; desc: string }[];

  metadataTitle?: string;
  metadataIntro?: string;
  /** Table column headings: field, EXIF tag, example. */
  metadataHeaders?: [string, string, string];
  /** `tag` defaults to EXIF_TAGS[index]. */
  metadataRows?: { field: string; tag?: string; example: string }[];
  metadataNote?: string;

  useCasesTitle?: string;
  useCases?: { title: string; desc: string }[];

  seoTitle: string;
  seoParagraphs: string[];
  seoChecklistTitle?: string;
  seoChecklist?: string[];

  privacyTitle: string;
  privacyParagraphs: string[];

  formatsTitle?: string;
  /** `level` (badge colour) defaults to FORMAT_LEVELS[index]. */
  formats?: { format: string; support: string; level?: FormatLevel; note: string }[];

  faqTitle: string;
  faqSubtitle?: string;
  faqs: Faq[];

  finalCtaTitle?: string;
  finalCtaText?: string;
  finalCtaButton?: string;
};

export type FeatureIcon =
  | 'map'
  | 'crosshair'
  | 'layers'
  | 'tag'
  | 'sparkles'
  | 'image'
  | 'link'
  | 'crop';

export type FormatLevel = 'full' | 'good' | 'converted';

// Shared defaults so locale files only carry text, in the same order as English.
export const FEATURE_ICON_ORDER: FeatureIcon[] = ['map', 'crosshair', 'layers', 'tag', 'image', 'link', 'crop'];
export const EXIF_TAGS = [
  'GPSLatitude, GPSLongitude (+ Ref)',
  'ImageDescription, XPTitle',
  'XPComment',
  'XPKeywords',
  'Artist, XPAuthor',
  'UserComment',
  'DateTimeOriginal, Make, Model',
];
export const FORMAT_LEVELS: FormatLevel[] = ['full', 'good', 'good', 'converted', 'converted'];

export const TOOL_PAGE_EN: ToolPageContent = {
  metaTitle: 'Free Geo Tagging Tool – Add GPS Location to Photos Online',
  metaDescription:
    'Geotag photos online for free. Add GPS coordinates, title, keywords and business details to JPG, PNG, WebP and HEIC images. No sign-up, no watermark.',
  eyebrow: 'Free · No sign-up · No watermark',
  h1: 'Free Geo Tagging Tool: Add GPS Location to Photos Online',
  subtitle:
    'Pin a spot on the map, add your business details, and download photos with GPS coordinates and local SEO metadata written into the file. Works with JPG, PNG, WebP, HEIC and more. Up to 10 photos at once.',
  trustChips: ['100% free', 'Batch up to 10 photos', 'Photos never stored', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Geotag your photos',
  ctaSecondary: 'See how it works',

  stepsTitle: 'How to geotag a photo in 4 steps',
  stepsIntro:
    'You do not need Lightroom, ExifTool or any app. Everything happens on this page.',
  steps: [
    {
      title: 'Upload your photos',
      desc: 'Drag and drop up to 10 images, or paste a webpage URL to import its images. Existing EXIF data is read straight away.',
    },
    {
      title: 'Pin the location',
      desc: 'Search an address, business name or landmark, drag the map marker, use your current location, or type latitude and longitude.',
    },
    {
      title: 'Add local SEO details',
      desc: 'Fill in title, description, keywords, business name and address. The address fields fill in automatically from the pin.',
    },
    {
      title: 'Apply and download',
      desc: 'Choose an export format and compression, click apply, and download each photo or all of them as a ZIP.',
    },
  ],

  featuresTitle: 'Everything you need to geotag images',
  featuresIntro:
    'Built for business owners, SEO agencies and photographers who need location data in their images quickly.',
  features: [
    {
      icon: 'map',
      title: 'Map pin and address search',
      desc: 'Find any street, city, landmark or business, then fine-tune the exact spot by dragging the pin.',
    },
    {
      icon: 'crosshair',
      title: 'Exact coordinates',
      desc: 'Enter latitude and longitude by hand when you already know the location, down to the building.',
    },
    {
      icon: 'layers',
      title: 'Batch geotagging',
      desc: 'Tag up to 10 photos in one go with the same location, or override metadata for a single image.',
    },
    {
      icon: 'tag',
      title: 'Local SEO metadata',
      desc: 'Write title, description, keywords and business name into EXIF fields that Windows and most photo tools show.',
    },
    {
      icon: 'image',
      title: 'Convert and compress',
      desc: 'Export as JPG, PNG, WebP, AVIF or TIFF and shrink file size for faster page loads.',
    },
    {
      icon: 'link',
      title: 'Import from a URL',
      desc: 'Pull images from a public webpage or a direct image link instead of downloading them first.',
    },
    {
      icon: 'crop',
      title: 'Crop and edit',
      desc: 'Crop to a preset ratio or freehand before tagging, so the photo is ready to upload.',
    },
  ],

  metadataTitle: 'What the tool writes into your photo',
  metadataIntro:
    'Geotagging means storing a location inside the image file itself, in its EXIF metadata. Here is exactly what PinPixl writes:',
  metadataHeaders: ['Field', 'EXIF tag', 'Example'],
  metadataRows: [
    { field: 'GPS location', tag: 'GPSLatitude, GPSLongitude (+ Ref)', example: '30.2672° N, 97.7431° W' },
    { field: 'Title', tag: 'ImageDescription, XPTitle', example: 'Fresh sourdough at our Austin bakery' },
    { field: 'Description', tag: 'XPComment', example: 'Morning bake at our South Congress shop.' },
    { field: 'Keywords', tag: 'XPKeywords', example: 'bakery, sourdough, Austin TX' },
    { field: 'Business name', tag: 'Artist, XPAuthor', example: 'Your Business Name' },
    { field: 'City, country and more', tag: 'UserComment', example: 'City: Austin; Country: United States' },
    { field: 'Date taken, camera', tag: 'DateTimeOriginal, Make, Model', example: '2026:11:18 10:30:00' },
  ],
  metadataNote:
    'JPG gives the most reliable results. Other formats are converted, and support for some fields depends on the platform where you upload the image.',

  useCasesTitle: 'Who uses a photo geotagging tool?',
  useCases: [
    {
      title: 'Google Business Profile owners',
      desc: 'Prepare storefront, team and work photos with consistent location details before you post them to your profile.',
    },
    {
      title: 'SEO and marketing agencies',
      desc: 'Tag client photos in batches with the right business name, keywords and address for each location.',
    },
    {
      title: 'Real estate agents',
      desc: 'Record exactly where each property photo was taken so listings and archives stay organised.',
    },
    {
      title: 'Contractors and home services',
      desc: 'Prove where a job was done. Before-and-after photos carry the job site location.',
    },
    {
      title: 'Photographers and travellers',
      desc: 'Add a location to photos taken on cameras without GPS so they appear on maps in Google Photos, Apple Photos or Lightroom.',
    },
    {
      title: 'Website owners',
      desc: 'Compress and convert images for faster pages while keeping useful, descriptive metadata in the file.',
    },
  ],

  seoTitle: 'Does geotagging photos help local SEO? The honest answer',
  seoParagraphs: [
    'Geotagging is often sold as a ranking trick. It is not. Google has never confirmed that the GPS data inside an image is a ranking factor, and images shown on Google Business Profile have their EXIF metadata removed when they are published.',
    'So why geotag at all? Because location metadata keeps your image library accurate, helps photo apps and maps place your images correctly, and adds one more consistent location detail on files you publish on your own website and directories. Think of it as good housekeeping that supports your local SEO, not a replacement for it.',
    'The photo signals that clearly matter for local search are the ones people and Google can see: real photos of your business, descriptive file names, useful alt text, and a business name, address and phone number that match everywhere.',
  ],
  seoChecklistTitle: 'A local image SEO checklist that works',
  seoChecklist: [
    'Use real photos of your premises, team and work. Avoid stock images.',
    'Rename files to describe them, for example sourdough-bakery-austin.jpg rather than IMG_4521.jpg.',
    'Write alt text that describes what is in the photo, not a list of keywords.',
    'Compress images so pages load fast on mobile.',
    'Post new photos to your Google Business Profile regularly.',
    'Keep your business name, address and phone number identical across your site and listings.',
  ],

  privacyTitle: 'How your photos are handled',
  privacyParagraphs: [
    'To write metadata and convert formats, your photo is sent over an encrypted connection to our server, processed in memory, and returned to you as a download. We do not save your photos to disk, keep copies, or use them for anything else.',
    'There is no account, so there is nothing linking your photos to you. Location search uses public map data.',
  ],

  formatsTitle: 'Supported image formats',
  formats: [
    { format: 'JPG / JPEG', support: 'Full', note: 'Best choice. GPS and all text fields are supported everywhere.' },
    { format: 'PNG', support: 'Good', note: 'GPS is written, but some sites and apps ignore PNG metadata.' },
    { format: 'WebP', support: 'Good', note: 'Small files for websites. Metadata support varies by platform.' },
    { format: 'HEIC / HEIF', support: 'Converted', note: 'iPhone photos. Convert to JPG for the widest support.' },
    { format: 'AVIF, TIFF', support: 'Converted', note: 'Accepted and exported. Check that your target platform reads the metadata.' },
  ],

  faqTitle: 'Frequently asked questions',
  faqSubtitle: 'Common questions about geotagging photos and image metadata.',
  faqs: [
    {
      q: 'What is a geo tagging tool?',
      a: 'A geo tagging tool adds GPS coordinates (latitude and longitude) to the EXIF metadata of an image file, so the photo carries the location where it was taken or where its subject is. PinPixl also lets you add a title, description, keywords and business name.',
    },
    {
      q: 'How do I add GPS location to a photo online?',
      a: 'Upload the photo above, search for an address or drag the pin on the map, then click apply. The tool writes the coordinates into the file and you download the geotagged photo. It takes under a minute and needs no software.',
    },
    {
      q: 'Is this geotagging tool really free?',
      a: 'Yes. There is no sign-up, no watermark and no paid plan. You can geotag up to 10 photos per batch, each up to 10 MB.',
    },
    {
      q: 'Does geotagging photos improve Google rankings?',
      a: 'Not directly. Google has not confirmed image GPS data as a ranking factor, and Google Business Profile removes EXIF data from published photos. Geotagging is useful for organising images and keeping location details consistent, but real photos, good file names, alt text and consistent business details matter more.',
    },
    {
      q: 'Should I geotag photos before uploading them to Google Business Profile?',
      a: 'It does no harm and keeps your original files organised, but do not expect a ranking boost from it alone. Focus on uploading real, recent, high-quality photos regularly.',
    },
    {
      q: 'Do you store my photos?',
      a: 'No. Photos are processed in memory on our server only to write the metadata and convert the format, then returned to you. They are not saved, shared or used for anything else.',
    },
    {
      q: 'How can I check if a photo has GPS data?',
      a: 'Upload it to the tool and the existing metadata appears straight away. On Windows, right-click the file and open Properties then Details. On a Mac, open it in Preview and choose Tools then Show Inspector.',
    },
    {
      q: 'Can I geotag iPhone HEIC photos?',
      a: 'Yes. HEIC and HEIF files are accepted. For the best compatibility, export them as JPG, which every platform reads correctly.',
    },
    {
      q: 'Can I geotag several photos at once?',
      a: 'Yes. Upload up to 10 photos, pin one location and apply it to all of them, then download them together as a ZIP. You can still edit metadata for individual photos.',
    },
    {
      q: 'Will geotagging reduce my image quality?',
      a: 'No, not unless you choose compression or a different export format. With compression set to None and format set to Keep Original, only the metadata changes.',
    },
  ],

  finalCtaTitle: 'Ready to geotag your photos?',
  finalCtaText: 'Free, no sign-up, and done in under a minute.',
  finalCtaButton: 'Start geotagging',
};

/**
 * Builds page content for a language: English, then a native locale page if one
 * exists, otherwise a short page from the strings in messages/<lang>.json.
 */
export function buildToolPageContent(lang: string, messages: any, labels: any): ToolPageContent {
  if (lang === 'en') return TOOL_PAGE_EN;
  if (LOCALE_PAGES[lang]) return LOCALE_PAGES[lang];

  const m = messages?.tool || {};
  const strip = (s?: string) => (s || '').replace(/^\s*\d+\.\s*/, '');

  return {
    h1: m.h1 || TOOL_PAGE_EN.h1,
    subtitle: m.subtitle || TOOL_PAGE_EN.subtitle,
    stepsTitle: m.howItWorks || TOOL_PAGE_EN.stepsTitle,
    stepsIntro: m.howItWorksDesc,
    steps: [
      { title: strip(m.step1Title), desc: m.step1Desc },
      { title: strip(m.step2Title), desc: m.step2Desc },
      { title: strip(m.step3Title), desc: m.step3Desc },
    ].filter((s) => s.title && s.desc),
    seoTitle: m.seoTitle || '',
    seoParagraphs: m.seoDesc ? [m.seoDesc] : [],
    privacyTitle: m.privacyTitle || '',
    privacyParagraphs: m.privacyDesc ? [m.privacyDesc] : [],
    faqTitle: labels?.faqTitle || TOOL_PAGE_EN.faqTitle,
    faqSubtitle: labels?.faqSubtitle,
    faqs: messages?.faq || [],
  };
}
