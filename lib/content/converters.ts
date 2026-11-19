import type { Landing } from './landing';
import { FORMAT_LABEL } from '@/lib/tools';

// Content for the converter pages. Each pair has its own intro, reasons and FAQs;
// the format comparison table is built from FORMAT_INFO.

type Fmt = 'heic' | 'jpg' | 'png' | 'webp' | 'avif' | 'svg' | 'gif' | 'bmp' | 'tiff';

const FORMAT_INFO: Record<Fmt, { full: string; compression: string; transparency: string; support: string; bestFor: string }> = {
  heic: { full: 'High Efficiency Image Container (HEVC)', compression: 'Lossy, very efficient', transparency: 'Yes', support: 'Apple devices; poor on Windows and the web', bestFor: 'Storing iPhone photos' },
  jpg: { full: 'Joint Photographic Experts Group', compression: 'Lossy', transparency: 'No', support: 'Everywhere', bestFor: 'Photos you share or upload anywhere' },
  png: { full: 'Portable Network Graphics', compression: 'Lossless', transparency: 'Yes', support: 'Everywhere', bestFor: 'Logos, screenshots, graphics with text' },
  webp: { full: 'WebP (Google)', compression: 'Lossy or lossless', transparency: 'Yes', support: 'All modern browsers; some older apps', bestFor: 'Fast-loading website images' },
  avif: { full: 'AV1 Image File Format', compression: 'Lossy, very efficient', transparency: 'Yes', support: 'Modern browsers; limited in editing apps', bestFor: 'Smallest web images' },
  svg: { full: 'Scalable Vector Graphics', compression: 'Vector (text-based)', transparency: 'Yes', support: 'Browsers; not most social sites', bestFor: 'Logos and icons at any size' },
  gif: { full: 'Graphics Interchange Format', compression: 'Lossless, max 256 colors', transparency: 'Yes (on/off only)', support: 'Everywhere', bestFor: 'Short animations and simple graphics' },
  bmp: { full: 'Bitmap Image File', compression: 'Usually none (very large files)', transparency: 'Rarely', support: 'Windows; poor on the web', bestFor: 'Legacy Windows software' },
  tiff: { full: 'Tagged Image File Format', compression: 'Lossless or none', transparency: 'Yes', support: 'Print and pro software; not browsers', bestFor: 'Scans, print and archiving' },
};

type PairCopy = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  why: string[];
  whyTitle: string;
  extra?: { title: string; paragraphs: string[] };
  faqs: { q: string; a: string }[];
};

const PAIRS: Record<string, PairCopy> = {
  'heic-jpg': {
    h1: 'HEIC to JPG Converter',
    metaTitle: 'HEIC to JPG Converter – Free, Private, No Upload',
    metaDescription: 'Convert iPhone HEIC photos to JPG free in your browser. Batch convert up to 20 photos, keep quality, no upload and no sign-up. Works on Windows, Mac and Android.',
    subtitle: 'Turn iPhone HEIC photos into JPGs that open everywhere. Converted right in your browser, so your photos never leave your device.',
    whyTitle: 'Why convert HEIC to JPG?',
    why: [
      'Windows, many Android phones and most websites still can’t open HEIC files.',
      'Upload forms, Google Business Profile, marketplaces and email clients accept JPG without problems.',
      'Older photo editors and printing services only take JPG.',
      'Sharing a JPG means the person you send it to can always open it.',
    ],
    extra: {
      title: 'How to stop your iPhone saving HEIC',
      paragraphs: [
        'If you’d rather your iPhone took JPGs from the start, open Settings › Camera › Formats and choose Most Compatible. New photos will be JPG; existing ones stay HEIC, which is what this converter is for.',
        'When you AirDrop or email photos from an iPhone, iOS often converts them to JPG automatically. Copying them over a cable or from iCloud for Windows keeps the original HEIC files.',
      ],
    },
    faqs: [
      { q: 'Is it safe to convert HEIC to JPG here?', a: 'Yes. The conversion runs inside your browser using a WebAssembly version of the libheif decoder. Your photos are not uploaded to any server.' },
      { q: 'Will I lose quality converting HEIC to JPG?', a: 'At the default 90% quality the difference is not visible for normal viewing. JPG files are usually a bit larger than HEIC for the same quality, because HEIC compresses more efficiently.' },
      { q: 'Can I convert many HEIC photos at once?', a: 'Yes. Add up to 20 photos, convert them together and download them all in one ZIP file.' },
      { q: 'Does the JPG keep the photo’s location and date?', a: 'No. The browser decoder outputs only the image, so EXIF data like GPS and date taken are not carried over. That is often what people want when sharing. To add a location back, use our free Geo Tagging Tool.' },
    ],
  },
  'heic-png': {
    h1: 'HEIC to PNG Converter',
    metaTitle: 'HEIC to PNG Converter – Free and Lossless, No Upload',
    metaDescription: 'Convert HEIC photos to lossless PNG free in your browser. Keeps full quality for editing, batch converts up to 20 files, and nothing is uploaded.',
    subtitle: 'Convert iPhone HEIC images to lossless PNG for editing, design work or anywhere you need maximum quality.',
    whyTitle: 'When HEIC to PNG makes sense',
    why: [
      'PNG is lossless, so you get every pixel of the decoded photo with no extra compression.',
      'Design tools and slide decks handle PNG reliably.',
      'Good for screenshots and images with text taken on an iPhone.',
      'Choose JPG instead if you just want to share photos: PNG files are much larger.',
    ],
    faqs: [
      { q: 'Why is my PNG so much bigger than the HEIC?', a: 'HEIC uses very efficient lossy compression, while PNG is lossless. A 2 MB HEIC photo can become a 10–20 MB PNG. Use HEIC to JPG for smaller files.' },
      { q: 'Are my photos uploaded?', a: 'No. Decoding and conversion run in your browser. Nothing leaves your device.' },
      { q: 'Does PNG keep transparency from HEIC?', a: 'Yes, if the HEIC image has transparency (rare for camera photos), the PNG keeps it.' },
    ],
  },
  'webp-jpg': {
    h1: 'WebP to JPG Converter',
    metaTitle: 'WebP to JPG Converter – Free Online, No Upload',
    metaDescription: 'Convert WebP images to JPG free. Batch convert up to 20 files in your browser with adjustable quality. No upload, no sign-up, no watermark.',
    subtitle: 'Saved an image from a website and it won’t open? Convert WebP to JPG in seconds, right in your browser.',
    whyTitle: 'Why convert WebP to JPG?',
    why: [
      'Many websites serve images as WebP, but older apps, Office versions and some upload forms don’t accept it.',
      'JPG works in every photo viewer, editor, printer and social network.',
      'Some email clients and messaging apps show WebP attachments as files instead of images.',
    ],
    faqs: [
      { q: 'Why do images I save from websites end up as WebP?', a: 'Websites use WebP because it is smaller than JPG at the same quality, so pages load faster. Your browser saves the file in the format the site sent.' },
      { q: 'What happens to transparent areas?', a: 'JPG can’t store transparency, so transparent parts are filled with a background color. It is white by default and you can change it before converting.' },
      { q: 'Is anything uploaded?', a: 'No. Conversion happens in your browser using the built-in image encoder.' },
    ],
  },
  'webp-png': {
    h1: 'WebP to PNG Converter',
    metaTitle: 'WebP to PNG Converter – Keep Transparency, Free',
    metaDescription: 'Convert WebP to PNG free and keep transparent backgrounds. Lossless output, batch up to 20 files, all in your browser with no upload.',
    subtitle: 'Convert WebP images to PNG while keeping transparent backgrounds, ideal for logos, stickers and graphics.',
    whyTitle: 'Why convert WebP to PNG?',
    why: [
      'PNG keeps transparency, unlike JPG.',
      'Design apps, presentation software and older editors handle PNG better than WebP.',
      'Lossless output means no extra quality loss when you edit the image further.',
    ],
    faqs: [
      { q: 'Will the transparent background be kept?', a: 'Yes. PNG supports transparency, so transparent areas in the WebP stay transparent.' },
      { q: 'Why is the PNG larger than the WebP?', a: 'PNG is lossless and less efficient than WebP. If file size matters more than transparency, convert WebP to JPG instead.' },
      { q: 'Is it private?', a: 'Yes. Files are converted in your browser and never uploaded.' },
    ],
  },
  'jpg-webp': {
    h1: 'JPG to WebP Converter',
    metaTitle: 'JPG to WebP Converter – Smaller Images, Faster Site',
    metaDescription: 'Convert JPG to WebP free to make website images 25–35% smaller. Batch convert, set quality and resize in your browser. No upload, no sign-up.',
    subtitle: 'Make your website images smaller and faster. Convert JPG to WebP with adjustable quality and optional resizing.',
    whyTitle: 'Why convert JPG to WebP?',
    why: [
      'WebP files are typically 25–35% smaller than JPG at similar visual quality.',
      'Smaller images make pages load faster, which helps Core Web Vitals and mobile visitors.',
      'Every modern browser supports WebP, including Chrome, Safari, Firefox and Edge.',
      'WordPress, Shopify and most site builders accept WebP uploads.',
    ],
    extra: {
      title: 'Tips for website images',
      paragraphs: [
        'Resize before converting: a 4000 px photo shown at 1200 px wide wastes bandwidth. Use the Resize option to cap the width.',
        'Quality around 80–85% is a good balance for photos on the web. Keep a JPG copy if you also need the image for print or email.',
      ],
    },
    faqs: [
      { q: 'How much smaller will my images get?', a: 'It depends on the photo, but 25–35% smaller than JPG at similar quality is common. Combined with resizing, savings of 70% or more are typical for large camera photos.' },
      { q: 'Does WebP work in all browsers?', a: 'Yes, all current versions of Chrome, Safari, Firefox and Edge support WebP. Some older desktop apps and email clients do not.' },
      { q: 'Are my files uploaded?', a: 'No. Conversion runs in your browser. If an older browser can’t encode WebP, the image is converted on our server in memory and not stored.' },
    ],
  },
  'png-webp': {
    h1: 'PNG to WebP Converter',
    metaTitle: 'PNG to WebP Converter – Free, Keeps Transparency',
    metaDescription: 'Convert PNG to WebP free. Much smaller files that keep transparent backgrounds. Batch convert up to 20 images in your browser with no upload.',
    subtitle: 'Shrink PNG graphics, screenshots and logos by converting them to WebP, with transparency kept intact.',
    whyTitle: 'Why convert PNG to WebP?',
    why: [
      'WebP supports transparency like PNG but is usually far smaller.',
      'Large PNG screenshots and illustrations are a common reason pages load slowly.',
      'Supported by all modern browsers and popular site builders.',
    ],
    faqs: [
      { q: 'Will my transparent background stay transparent?', a: 'Yes. WebP supports transparency, so transparent areas are kept.' },
      { q: 'Should I use high quality for logos?', a: 'For logos, text and sharp graphics use 95–100% to avoid soft edges. For photos saved as PNG, 80–90% is usually fine.' },
      { q: 'Is anything uploaded?', a: 'No, conversion runs in your browser. Older browsers that can’t encode WebP use our server, which processes the image in memory and does not store it.' },
    ],
  },
  'png-jpg': {
    h1: 'PNG to JPG Converter',
    metaTitle: 'PNG to JPG Converter – Free Online, No Upload',
    metaDescription: 'Convert PNG to JPG free and make files much smaller. Choose the background color for transparent areas, set quality and batch convert in your browser.',
    subtitle: 'Turn big PNG files into compact JPGs, with your choice of background color for transparent areas.',
    whyTitle: 'Why convert PNG to JPG?',
    why: [
      'JPG photos are often 5–10× smaller than the same image saved as PNG.',
      'Some upload forms limit file size or only accept JPG.',
      'JPG is the better format for photographs; PNG is meant for graphics.',
    ],
    faqs: [
      { q: 'What happens to the transparent background?', a: 'JPG can’t store transparency, so transparent areas are filled with the background color you choose (white by default).' },
      { q: 'Will text and logos look blurry?', a: 'JPG can blur sharp edges at low quality. For screenshots and logos, use 95% quality or keep them as PNG or WebP.' },
      { q: 'Are my files uploaded?', a: 'No. Everything runs in your browser.' },
    ],
  },
  'jpg-png': {
    h1: 'JPG to PNG Converter',
    metaTitle: 'JPG to PNG Converter – Free, Lossless Output',
    metaDescription: 'Convert JPG to PNG free in your browser. Lossless output for editing and design, batch up to 20 files, no upload and no watermark.',
    subtitle: 'Convert JPG images to lossless PNG for editing, design tools or anywhere that requires PNG.',
    whyTitle: 'When to convert JPG to PNG',
    why: [
      'Some apps, templates and upload forms require PNG.',
      'Editing a PNG and re-saving it adds no further compression loss.',
      'Note: converting does not add transparency. The background stays as it is in the JPG.',
    ],
    faqs: [
      { q: 'Will converting JPG to PNG improve quality?', a: 'No. PNG is lossless from this point on, but it can’t restore detail already lost to JPG compression.' },
      { q: 'Will the background become transparent?', a: 'No. JPG has no transparency, so the PNG keeps the same solid background. Removing a background needs a separate tool.' },
      { q: 'Why is the PNG bigger?', a: 'PNG stores every pixel without lossy compression, so photo PNGs are usually several times larger than JPGs.' },
    ],
  },
  'avif-jpg': {
    h1: 'AVIF to JPG Converter',
    metaTitle: 'AVIF to JPG Converter – Free Online, No Upload',
    metaDescription: 'Convert AVIF images to JPG free. Open AVIF files saved from websites in any app. Batch convert in your browser, nothing uploaded.',
    subtitle: 'Got an .avif file you can’t open? Convert AVIF to JPG so it works in every app and upload form.',
    whyTitle: 'Why convert AVIF to JPG?',
    why: [
      'AVIF is a newer format that many photo apps, Office and upload forms don’t support yet.',
      'Websites increasingly serve AVIF, so saved images often end up in this format.',
      'JPG opens everywhere.',
    ],
    faqs: [
      { q: 'What is an AVIF file?', a: 'AVIF is an image format based on the AV1 video codec. It makes very small, high-quality images, so websites use it to load faster.' },
      { q: 'My browser can’t read the AVIF. What now?', a: 'All current versions of Chrome, Edge, Firefox and Safari can decode AVIF. Update your browser if conversion fails.' },
      { q: 'Is anything uploaded?', a: 'No. Conversion runs in your browser.' },
    ],
  },
  'avif-png': {
    h1: 'AVIF to PNG Converter',
    metaTitle: 'AVIF to PNG Converter – Free, Keeps Transparency',
    metaDescription: 'Convert AVIF to PNG free and keep transparency. Lossless output for editing, batch up to 20 files, all in your browser.',
    subtitle: 'Convert AVIF images to PNG, keeping transparency, for editing and design tools that don’t read AVIF.',
    whyTitle: 'Why convert AVIF to PNG?',
    why: [
      'PNG keeps transparency and opens in every editor.',
      'Lossless output avoids further quality loss while you edit.',
      'Useful for AVIF graphics and stickers saved from websites.',
    ],
    faqs: [
      { q: 'Does PNG keep AVIF transparency?', a: 'Yes. Transparent areas stay transparent.' },
      { q: 'Why is the PNG so large?', a: 'AVIF compresses far better than PNG. Use AVIF to JPG if you need a small file and don’t need transparency.' },
      { q: 'Is it private?', a: 'Yes, files are converted in your browser and never uploaded.' },
    ],
  },
  'svg-png': {
    h1: 'SVG to PNG Converter',
    metaTitle: 'SVG to PNG Converter – Free, Any Size, Transparent',
    metaDescription: 'Convert SVG to PNG free at the size you need, with transparent background. Perfect for logos and icons. Runs in your browser, no upload.',
    subtitle: 'Turn SVG logos and icons into PNG images with a transparent background, for social media, documents and apps that don’t accept SVG.',
    whyTitle: 'Why convert SVG to PNG?',
    why: [
      'Social networks, Google Business Profile and most upload forms don’t accept SVG.',
      'Word, PowerPoint on older versions and many email clients display PNG reliably.',
      'PNG keeps the transparent background of your logo.',
    ],
    faqs: [
      { q: 'What size will the PNG be?', a: 'The SVG’s own width and height are used. Use the Resize option to cap the size, or open the SVG in a design tool to change its dimensions first.' },
      { q: 'Will the background be transparent?', a: 'Yes. Anything without a fill in the SVG stays transparent in the PNG.' },
      { q: 'Are fonts and external images included?', a: 'Shapes and embedded content are drawn exactly. SVGs that load fonts or images from other websites may render without them, because browsers block external resources in this mode.' },
    ],
  },
  'gif-jpg': {
    h1: 'GIF to JPG Converter',
    metaTitle: 'GIF to JPG Converter – Free Online, No Upload',
    metaDescription: 'Convert GIF images to JPG free in your browser. Turn a GIF into a still JPG photo, batch convert up to 20 files, no upload and no sign-up.',
    subtitle: 'Turn GIF images into JPG stills that upload anywhere. The first frame of an animated GIF is saved as a high-quality JPG, right in your browser.',
    whyTitle: 'Why convert GIF to JPG?',
    why: [
      'Many upload forms, profile pictures and print services accept JPG but reject GIF.',
      'GIF is limited to 256 colors, so photos saved as GIF look grainy; JPG shows full color.',
      'You only need one still image from an animation, for a thumbnail or a document.',
      'JPG is smaller than GIF for photo-like images.',
    ],
    faqs: [
      { q: 'What happens to an animated GIF?', a: 'JPG cannot store animation, so the first frame is converted to a still JPG. If you need the animation, keep the GIF or convert it to WebP, which supports animation in browsers.' },
      { q: 'Will the colors improve?', a: 'The JPG shows exactly the colors that are in the GIF. Converting can’t add colors that GIF’s 256-color palette removed, but it won’t make them worse either.' },
      { q: 'What about transparent areas?', a: 'JPG has no transparency, so transparent pixels are filled with a background color you choose (white by default).' },
    ],
  },
  'gif-png': {
    h1: 'GIF to PNG Converter',
    metaTitle: 'GIF to PNG Converter – Free, Keeps Transparency',
    metaDescription: 'Convert GIF to PNG free in your browser. Keeps transparency and every pixel, batch converts up to 20 files, with no upload and no sign-up.',
    subtitle: 'Convert GIF images to lossless PNG with transparency intact. Ideal for logos, icons and graphics you want to edit.',
    whyTitle: 'Why convert GIF to PNG?',
    why: [
      'PNG keeps every pixel of the GIF, with no quality loss.',
      'PNG supports smooth, partial transparency; GIF only has fully on or off.',
      'Design and editing tools handle PNG better than GIF.',
      'PNG is the standard for logos, icons and screenshots on the web.',
    ],
    faqs: [
      { q: 'Is the conversion lossless?', a: 'Yes. PNG is lossless, so the result looks exactly like the GIF’s first frame.' },
      { q: 'Does it keep the animation?', a: 'No. PNG is a still format, so the first frame is saved. For animation in browsers, use GIF to WebP.' },
      { q: 'Is transparency kept?', a: 'Yes. Transparent areas in the GIF stay transparent in the PNG.' },
    ],
  },
  'gif-webp': {
    h1: 'GIF to WebP Converter',
    metaTitle: 'GIF to WebP Converter – Smaller Images, Free',
    metaDescription: 'Convert GIF to WebP free. WebP files are much smaller than GIF and keep transparency, which makes your pages load faster. No sign-up.',
    subtitle: 'Turn heavy GIFs into lightweight WebP images for your website. Smaller files, full color and transparency, converted in your browser.',
    whyTitle: 'Why convert GIF to WebP?',
    why: [
      'WebP images are often far smaller than the same GIF, so pages load faster.',
      'WebP shows millions of colors, not GIF’s 256.',
      'Every modern browser supports WebP.',
      'Lighter images help Core Web Vitals and mobile visitors.',
    ],
    faqs: [
      { q: 'Is the animation kept?', a: 'This converter saves the first frame as a still WebP image. Animated WebP is possible, but converting animations needs a video-style encoder that isn’t part of this tool.' },
      { q: 'Will older apps open WebP?', a: 'All modern browsers do. Some older desktop apps and email clients don’t, so keep a JPG or PNG copy if you also send the image by email.' },
      { q: 'Is anything uploaded?', a: 'Normally no. Only if your browser can’t create WebP files is the image converted on our server, in memory, and never stored.' },
    ],
  },
  'bmp-jpg': {
    h1: 'BMP to JPG Converter',
    metaTitle: 'BMP to JPG Converter – Shrink BMP Files, Free',
    metaDescription: 'Convert BMP to JPG free in your browser. Make huge bitmap files small enough to email and upload. Batch convert, no upload, no sign-up.',
    subtitle: 'Turn large BMP bitmaps into compact JPGs you can email, upload and share. Converted in your browser, nothing is uploaded.',
    whyTitle: 'Why convert BMP to JPG?',
    why: [
      'BMP files are usually uncompressed, so they are often 10 to 20 times larger than a JPG of the same image.',
      'Websites, social networks and upload forms rarely accept BMP.',
      'Email attachment limits are easy to hit with BMP files.',
      'JPG opens on every phone, computer and browser.',
    ],
    faqs: [
      { q: 'How much smaller will the file be?', a: 'It depends on the image, but a photo-like BMP commonly shrinks by 90% or more as a JPG at 90% quality, with no visible difference.' },
      { q: 'Should I use JPG or PNG?', a: 'Use JPG for photos and PNG for screenshots, diagrams or anything with sharp text, where JPG can show soft edges.' },
      { q: 'Where do BMP files come from?', a: 'Mostly older Windows programs, Paint, scanners and some industrial or medical software that save uncompressed bitmaps.' },
    ],
  },
  'bmp-png': {
    h1: 'BMP to PNG Converter',
    metaTitle: 'BMP to PNG Converter – Lossless and Free',
    metaDescription: 'Convert BMP to PNG free in your browser. Lossless, much smaller files that work on the web. Batch convert up to 20 images, no upload.',
    subtitle: 'Convert BMP bitmaps to lossless PNG: same pixels, far smaller files, and support on every website and device.',
    whyTitle: 'Why convert BMP to PNG?',
    why: [
      'PNG is lossless like BMP, so nothing about the image changes.',
      'PNG compresses the data, so files are much smaller than BMP.',
      'PNG works on the web, in documents and in every image editor.',
      'Screenshots and diagrams stay perfectly sharp.',
    ],
    faqs: [
      { q: 'Is BMP to PNG lossless?', a: 'Yes. Both are lossless formats, so the PNG has exactly the same pixels as the BMP.' },
      { q: 'Why is the PNG so much smaller?', a: 'BMP usually stores every pixel uncompressed. PNG uses lossless compression, which removes redundancy without changing the image.' },
      { q: 'Can I convert many BMP files at once?', a: 'Yes, up to 20 at a time, downloaded together as a ZIP.' },
    ],
  },
  'tiff-jpg': {
    h1: 'TIFF to JPG Converter',
    metaTitle: 'TIFF to JPG Converter – Free Online, No Sign-up',
    metaDescription: 'Convert TIFF and TIF files to JPG free. Make scans and print files small enough to share and upload. Batch convert up to 20, no sign-up.',
    subtitle: 'Convert TIFF and TIF scans or print files to JPGs that open everywhere and are small enough to email or upload.',
    whyTitle: 'Why convert TIFF to JPG?',
    why: [
      'Browsers, websites and most phones can’t open TIFF files.',
      'TIFF scans are often tens of megabytes; a JPG is a fraction of that.',
      'Upload forms and email clients accept JPG without problems.',
      'JPG is ideal for sharing scanned photos and documents.',
    ],
    extra: {
      title: 'How TIFF files are processed',
      paragraphs: [
        'Most browsers can’t read TIFF, so Safari converts it locally while other browsers send the file to our server, which decodes it in memory and discards it immediately. Nothing is stored or logged.',
        'Multi-page TIFF files (common with scanners and faxes) are converted page one only. Save each page separately if you need all of them.',
      ],
    },
    faqs: [
      { q: 'Is TIFF to JPG lossy?', a: 'Yes, JPG is a lossy format, but at 90% quality the difference is not visible for normal viewing. Keep the TIFF as your master copy for printing or archiving.' },
      { q: 'Do you support .tif and .tiff?', a: 'Yes. Both extensions are the same format and are accepted.' },
      { q: 'What about multi-page TIFFs?', a: 'Only the first page is converted. For a whole scanned document, a PDF is usually the better format.' },
    ],
  },
  'tiff-png': {
    h1: 'TIFF to PNG Converter',
    metaTitle: 'TIFF to PNG Converter – Lossless, Free Online',
    metaDescription: 'Convert TIFF and TIF files to lossless PNG free. Keep full quality and transparency in a format every browser can open. No sign-up.',
    subtitle: 'Convert TIFF and TIF images to lossless PNG: full quality and transparency, in a format browsers and websites support.',
    whyTitle: 'Why convert TIFF to PNG?',
    why: [
      'PNG keeps full quality, like TIFF, but opens in every browser.',
      'Transparency in the TIFF is preserved.',
      'PNG is accepted by websites, CMSs and design tools.',
      'Good for scans with text, diagrams and line art.',
    ],
    extra: {
      title: 'How TIFF files are processed',
      paragraphs: [
        'Safari converts TIFF locally. Other browsers can’t read TIFF, so the file is decoded on our server in memory and discarded right away. Nothing is stored.',
      ],
    },
    faqs: [
      { q: 'Is TIFF to PNG lossless?', a: 'Yes. Both are lossless, so no detail is lost.' },
      { q: 'Will the PNG be smaller than the TIFF?', a: 'Often, yes, especially for uncompressed TIFFs. Highly detailed photos can stay large because PNG is lossless; use TIFF to JPG if size matters more.' },
      { q: 'Are multi-page TIFFs supported?', a: 'The first page is converted.' },
    ],
  },
  'svg-jpg': {
    h1: 'SVG to JPG Converter',
    metaTitle: 'SVG to JPG Converter – Free, Any Size, No Upload',
    metaDescription: 'Convert SVG to JPG free in your browser. Turn vector logos and icons into JPG images at the size you need. No upload, no sign-up.',
    subtitle: 'Turn SVG vector graphics into JPG images for places that don’t accept SVG, such as social media, documents and email.',
    whyTitle: 'Why convert SVG to JPG?',
    why: [
      'Social networks, marketplaces and many forms don’t accept SVG uploads.',
      'Email clients and office documents display JPG reliably.',
      'JPG gives you a fixed-size image for previews and thumbnails.',
      'Easy to share with people who don’t have design software.',
    ],
    faqs: [
      { q: 'What about the transparent background?', a: 'JPG has no transparency, so transparent areas are filled with the background color you pick. If you need transparency, use SVG to PNG instead.' },
      { q: 'What size will the JPG be?', a: 'It uses the size defined in the SVG (1024 pixels if none is set). Use the resize option to choose a different size.' },
      { q: 'Is anything uploaded?', a: 'No. SVG to JPG conversion runs entirely in your browser.' },
    ],
  },
};

const GENERIC_FAQS = [
  { q: 'Is this converter free?', a: 'Yes. No sign-up, no watermark and no daily limit. Convert up to 20 files at a time, each up to 25 MB.' },
  { q: 'Does it work on my phone?', a: 'Yes. It works in any modern mobile browser on iPhone and Android.' },
];

function table(from: Fmt, to: Fmt) {
  const a = FORMAT_INFO[from];
  const b = FORMAT_INFO[to];
  return {
    title: `${FORMAT_LABEL[from]} vs ${FORMAT_LABEL[to]}`,
    headers: ['', FORMAT_LABEL[from], FORMAT_LABEL[to]],
    rows: [
      ['Full name', a.full, b.full],
      ['Compression', a.compression, b.compression],
      ['Transparency', a.transparency, b.transparency],
      ['Support', a.support, b.support],
      ['Best for', a.bestFor, b.bestFor],
    ],
  };
}

const usesServerFallback = (to: string) => to === 'webp';
const serverDecode = (from: string) => from === 'tiff';

export function converterLanding(from: Fmt, to: Fmt): Landing {
  const key = `${from}-${to}`;
  const p = PAIRS[key];
  const F = FORMAT_LABEL[from];
  const T = FORMAT_LABEL[to];
  const relatedPairs = Object.keys(PAIRS)
    .filter((k) => k !== key && (k.startsWith(`${from}-`) || k.endsWith(`-${to}`) || k === `${to}-${from}`))
    .slice(0, 3)
    .map((k) => k.replace('-', '-to-'));

  return {
    id: `${from}-to-${to}`,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    h1: p.h1,
    subtitle: p.subtitle,
    chips: ['100% free', 'Batch up to 20 files', serverDecode(from) || (from !== 'heic' && usesServerFallback(to)) ? 'Nothing stored' : 'No upload', 'No watermark'],
    privacy: usesServerFallback(to) || serverDecode(from) ? 'mixed' : 'browser',
    privacyNote: serverDecode(from)
      ? `Safari converts ${F} to ${T} in your browser. Other browsers can’t read TIFF, so the file is decoded on our server in memory and discarded immediately. Nothing is stored.`
      : usesServerFallback(to)
      ? `${F} to ${T} conversion runs in your browser. Only if your browser can’t create WebP files is the image converted on our server, in memory, and never stored.`
      : `${F} to ${T} conversion runs entirely in your browser. Your images are never uploaded.`,
    stepsTitle: `How to convert ${F} to ${T}`,
    steps: [
      { title: `Add your ${F} files`, desc: `Drag and drop up to 20 ${F} images, or click to choose them from your device.` },
      { title: 'Adjust settings', desc: to === 'png' ? 'Optionally resize. PNG output is lossless.' : `Set the quality and optionally resize.${to === 'jpg' ? ' Pick a background color for transparent areas.' : ''}` },
      { title: `Convert and download`, desc: `Click Convert to ${T}, then download each file or all of them as a ZIP.` },
    ],
    sections: [
      { title: p.whyTitle, bullets: p.why },
      ...(p.extra ? [p.extra] : []),
    ],
    table: table(from, to),
    faqs: [...p.faqs, ...GENERIC_FAQS],
    related: [...relatedPairs, 'image-converter', 'image-compressor', 'remove-exif'].slice(0, 6),
  };
}

export const IMAGE_CONVERTER_LANDING: Landing = {
  id: 'image-converter',
  metaTitle: 'Free Image Converter – HEIC, WebP, PNG, JPG, AVIF, SVG',
  metaDescription: 'Convert images between HEIC, WebP, PNG, JPG, AVIF and SVG free in your browser. Batch convert, set quality, resize. No upload, no sign-up.',
  h1: 'Free Image Converter',
  subtitle: 'Convert HEIC, WebP, AVIF, SVG, PNG and JPG images to JPG, PNG or WebP. Batch convert, set quality and resize, all inside your browser.',
  chips: ['100% free', 'Batch up to 20 files', 'Mostly no upload', 'No watermark'],
  privacy: 'mixed',
  privacyNote: 'Images are converted in your browser. Only if your browser can’t create WebP files is the image converted on our server, in memory, and never stored.',
  stepsTitle: 'How to convert an image',
  steps: [
    { title: 'Add images', desc: 'Drop up to 20 images in any supported format, including iPhone HEIC.' },
    { title: 'Choose a format', desc: 'Pick JPG, PNG or WebP, then set quality and optional resizing.' },
    { title: 'Download', desc: 'Download each converted image or all of them as a ZIP.' },
  ],
  sections: [
    {
      title: 'Which format should I choose?',
      bullets: [
        'JPG: photos you want to share, email or upload anywhere. Small and universally supported.',
        'PNG: logos, screenshots and graphics with text or transparency. Lossless but larger.',
        'WebP: images for your website. Smaller than JPG and PNG, with transparency, supported by all modern browsers.',
      ],
    },
    {
      title: 'Popular conversions',
      paragraphs: ['Each conversion also has its own page with tips for that format: HEIC to JPG, WebP to JPG, JPG to WebP, PNG to JPG, PNG to WebP, SVG to PNG and more. Find them under More free tools below.'],
    },
  ],
  table: {
    title: 'Image formats compared',
    headers: ['Format', 'Compression', 'Transparency', 'Support', 'Best for'],
    rows: (Object.keys(FORMAT_INFO) as Fmt[]).map((f) => [FORMAT_LABEL[f], FORMAT_INFO[f].compression, FORMAT_INFO[f].transparency, FORMAT_INFO[f].support, FORMAT_INFO[f].bestFor]),
  },
  faqs: [
    { q: 'Which formats can I convert?', a: 'You can open HEIC/HEIF, JPG, PNG, WebP, AVIF, GIF (first frame), BMP, TIFF and SVG, and save as JPG, PNG or WebP.' },
    { q: 'Are my images uploaded?', a: 'Normally no; conversion runs in your browser. The only exception is WebP output in older browsers that can’t create WebP, where our server converts the image in memory and doesn’t store it.' },
    { q: 'Can I convert iPhone photos?', a: 'Yes. HEIC photos are decoded in your browser with a WebAssembly version of libheif.' },
    ...GENERIC_FAQS,
  ],
  related: ['heic-to-jpg', 'webp-to-jpg', 'jpg-to-webp', 'png-to-jpg', 'image-compressor', 'remove-exif'],
};
