import type { Landing } from './landing';

// English content for the resizer, image-to-PDF and compress-to-size tools.

export const IMAGE_RESIZER: Landing = {
  id: 'image-resizer',
  metaTitle: 'Image Resizer – Resize Photos Online by Pixels or Percent',
  metaDescription: 'Resize images free in your browser. Set exact pixels, scale by percent or pick Instagram, YouTube and Facebook sizes. Batch resize 20 photos, no upload.',
  h1: 'Image Resizer: Resize Photos Online Free',
  subtitle: 'Change the size of any photo by exact pixels, by percentage, or to a ready-made social media size. Batch resize up to 20 images without uploading them.',
  chips: ['100% free', 'Batch up to 20 files', 'No upload', 'No watermark'],
  privacy: 'browser',
  privacyNote: 'Images are resized inside your browser. They are never uploaded to a server.',
  stepsTitle: 'How to resize an image',
  steps: [
    { title: 'Add your images', desc: 'Drop up to 20 photos (JPG, PNG, WebP, HEIC and more) or click to choose them.' },
    { title: 'Pick a size', desc: 'Type a width or height in pixels, scale by percent, or choose a preset like Instagram post or YouTube thumbnail.' },
    { title: 'Resize and download', desc: 'Click Resize images, then download each one or all of them as a ZIP.' },
  ],
  sections: [
    {
      title: 'Three ways to resize',
      bullets: [
        'Pixels: enter a width, a height or both. With “Keep aspect ratio” on, the photo is never stretched.',
        'Percent: shrink a photo to 50% for email, or enlarge a small graphic up to 200%.',
        'Social size: one click for Instagram, Facebook, YouTube, X, LinkedIn, Google Business Profile or a 2×2 inch passport photo.',
      ],
    },
    {
      title: '“Fill & crop” or “Fit with border”?',
      paragraphs: [
        'Social presets have a fixed shape. Fill & crop scales the photo to cover the whole frame and trims what sticks out, which is what most platforms show. Fit with border keeps the entire photo visible and adds white bars where the shapes differ.',
      ],
    },
    {
      title: 'Resizing vs compressing',
      paragraphs: [
        'Resizing changes the pixel dimensions, for example 4000×3000 down to 1200×900. Compressing keeps the dimensions and lowers the file size. A form that asks for “200×230 pixels” needs resizing; one that asks for “under 50 KB” needs compression, and many forms ask for both.',
      ],
    },
  ],
  table: {
    title: 'Popular image sizes',
    headers: ['Use', 'Size (px)', 'Shape'],
    rows: [
      ['Instagram post', '1080 × 1080', 'Square'],
      ['Instagram portrait', '1080 × 1350', '4:5'],
      ['Instagram / TikTok story', '1080 × 1920', '9:16'],
      ['YouTube thumbnail', '1280 × 720', '16:9'],
      ['Facebook link image', '1200 × 630', '1.91:1'],
      ['LinkedIn banner', '1584 × 396', '4:1'],
      ['Passport photo (US)', '600 × 600', '2×2 in at 300 dpi'],
    ],
    note: 'Platforms change recommended sizes from time to time; these are common current values.',
  },
  faqs: [
    { q: 'Will resizing reduce quality?', a: 'Making an image smaller keeps it sharp. Making it larger can’t add detail, so big enlargements look soft. For the best result, resize from the original photo.' },
    { q: 'How do I resize without stretching the photo?', a: 'Keep “Keep aspect ratio” switched on and enter just a width or just a height. The other side is calculated automatically.' },
    { q: 'Can I resize several photos at once?', a: 'Yes. Add up to 20 images; they all get the same settings and can be downloaded together as a ZIP.' },
    { q: 'Does it work with iPhone photos?', a: 'Yes. HEIC photos are decoded in your browser and saved as JPG, PNG or WebP.' },
    { q: 'Are my photos uploaded?', a: 'No. Resizing runs entirely in your browser.' },
  ],
  related: ['image-compressor', 'compress-to-100kb', 'jpg-to-pdf', 'heic-to-jpg', 'jpg-to-webp', 'remove-exif'],
};

function pdfLanding(fmt: 'JPG' | 'PNG'): Landing {
  const jpg = fmt === 'JPG';
  return {
    id: jpg ? 'jpg-to-pdf' : 'png-to-pdf',
    metaTitle: jpg ? 'JPG to PDF Converter – Combine Photos Into One PDF, Free' : 'PNG to PDF Converter – Images and Screenshots to PDF, Free',
    metaDescription: jpg
      ? 'Convert JPG to PDF free in your browser. Combine up to 50 photos into one PDF, choose A4 or Letter, set margins. No upload, no watermark, no sign-up.'
      : 'Convert PNG to PDF free. Turn screenshots and images into one PDF, choose page size and order. Runs in your browser: no upload, no watermark.',
    h1: jpg ? 'JPG to PDF: Combine Photos Into One PDF' : 'PNG to PDF: Turn Images and Screenshots Into a PDF',
    subtitle: jpg
      ? 'Turn one or many JPG photos into a single PDF, in the order you choose. Pick A4, Letter or a page that fits each photo, all inside your browser.'
      : 'Put screenshots, scans and PNG graphics into one tidy PDF. Reorder pages, choose the paper size and download, without uploading anything.',
    chips: ['100% free', 'Up to 50 images', 'No upload', 'No watermark'],
    privacy: 'browser',
    privacyNote: 'The PDF is built inside your browser. Your images are never uploaded.',
    stepsTitle: jpg ? 'How to convert JPG to PDF' : 'How to convert PNG to PDF',
    steps: [
      { title: `Add your ${fmt} images`, desc: 'Drop up to 50 images. Other formats like HEIC, WebP and PNG/JPG work too.' },
      { title: 'Set the order and page', desc: 'Move pages up or down, choose A4, Letter or Fit image, and set orientation and margins.' },
      { title: 'Create and download', desc: 'Click Create PDF and download one file with every image as its own page.' },
    ],
    sections: jpg
      ? [
          {
            title: 'When you need a PDF instead of photos',
            bullets: [
              'Sending scanned documents, receipts or ID photos as one file instead of ten attachments.',
              'Upload forms that only accept PDF for documents.',
              'Printing photos on A4 or Letter with even margins.',
              'Sharing a photo report or portfolio that opens the same on every device.',
            ],
          },
          {
            title: 'Getting a small PDF for email',
            paragraphs: [
              'Phone photos are large, so a 20-photo PDF can be big. Lower the image quality to 70–80% for a much smaller file that still looks sharp on screen and in print. Very large photos are automatically capped at 3,000 pixels on the longest side.',
            ],
          },
        ]
      : [
          {
            title: 'Why turn PNGs into a PDF?',
            bullets: [
              'Combine a series of screenshots into one document for a report, bug ticket or tutorial.',
              'Share designs and diagrams in a format every device opens without extra software.',
              'Submit scans or certificates where a form asks for a PDF.',
            ],
          },
          {
            title: 'About transparency',
            paragraphs: [
              'Transparent areas of a PNG are placed on a white page in the PDF, which is how documents are normally printed and viewed.',
            ],
          },
        ],
    table: {
      title: 'Page size options',
      headers: ['Option', 'Size', 'Best for'],
      rows: [
        ['A4', '210 × 297 mm', 'Most of the world, printing and forms'],
        ['Letter', '8.5 × 11 in', 'USA and Canada'],
        ['Fit image', 'Same as each image', 'Screenshots and on-screen viewing'],
      ],
    },
    faqs: [
      { q: `How do I convert ${fmt} to PDF?`, a: 'Add your images, put them in order, choose a page size and click Create PDF. Each image becomes one page.' },
      { q: 'Can I combine several images into one PDF?', a: 'Yes, up to 50 images in one PDF, in any order you choose with the arrow buttons.' },
      { q: 'Are my images uploaded?', a: 'No. The PDF is generated in your browser, so your files never leave your device.' },
      { q: 'Is there a watermark?', a: 'No. There is no watermark, no sign-up and no daily limit.' },
      { q: 'Can I open the PDF on my phone?', a: 'Yes. The PDF is a standard file that opens in any PDF viewer, browser, Google Drive or Apple Files.' },
    ],
    related: jpg
      ? ['png-to-pdf', 'image-compressor', 'image-resizer', 'heic-to-jpg', 'remove-exif', 'compress-to-200kb']
      : ['jpg-to-pdf', 'png-to-jpg', 'image-compressor', 'image-resizer', 'remove-exif', 'svg-to-png'],
  };
}

export const JPG_TO_PDF = pdfLanding('JPG');
export const PNG_TO_PDF = pdfLanding('PNG');

type SizeCopy = { use: string; intro: string; uses: string[]; tip: string; faq: { q: string; a: string } };
const SIZE_COPY: Record<20 | 50 | 100 | 200, SizeCopy> = {
  20: {
    use: 'signatures and small photos for online forms',
    intro: 'Many exam, scholarship and government application portals ask for a scanned signature under 20 KB, and some for a tiny photo too. Get your image under the limit in seconds.',
    uses: [
      'Scanned signatures for exam and recruitment applications',
      'Thumbnail photos on online application portals',
      'Small profile images for forums and internal systems',
    ],
    tip: 'Signatures compress best when they are cropped tightly: sign in dark ink on plain white paper, crop away the empty space, then compress. Less empty space means more detail fits into 20 KB.',
    faq: { q: 'Can a photo really fit in 20 KB?', a: 'Yes, at a small size. A face photo around 200×230 pixels fits in 20 KB with good quality. Large photos are scaled down automatically until they fit.' },
  },
  50: {
    use: 'passport-size photos and application forms',
    intro: 'Exam registrations, visa and job portals often require a passport-size photo under 50 KB. This tool shrinks your photo to just under the limit while keeping your face clear.',
    uses: [
      'Passport-size photos for exam and job application forms',
      'Photos for university and scholarship portals',
      'ID photos for online registrations',
    ],
    tip: 'If the form also asks for exact dimensions (for example 200×230 or 350×450 pixels), resize first with the Image Resizer, then compress here. Starting at the right size gives the sharpest result.',
    faq: { q: 'Will my face still look clear at 50 KB?', a: 'Yes. At passport-photo dimensions, 50 KB is plenty for a sharp, clear face. The tool always picks the highest quality that fits.' },
  },
  100: {
    use: 'job portals, profiles and online applications',
    intro: 'Job sites, university portals and many online forms cap photo uploads at 100 KB. Get your photo under 100 KB without making it look blurry or blocky.',
    uses: [
      'Profile photos on job portals and CV builders',
      'Photos and scans for university applications',
      'Images for online forms that reject large phone photos',
    ],
    tip: 'A modern phone photo is often 3–5 MB. At 100 KB the tool usually keeps a resolution good enough for screens; the exact size it picks is shown next to each file.',
    faq: { q: 'Why was my photo made smaller in pixels?', a: 'When even moderate JPG quality is still over 100 KB, the tool reduces the dimensions step by step. That keeps the image clean instead of covering it with compression artefacts.' },
  },
  200: {
    use: 'ID scans, documents and email-friendly photos',
    intro: 'Uploading ID cards, certificates or document scans? Many portals allow up to 200 KB. This keeps text readable while getting the file under the limit.',
    uses: [
      'Scans of ID cards, certificates and mark sheets',
      'Photos for online marketplaces and classifieds',
      'Images that need to stay sharp but fit email or form limits',
    ],
    tip: 'For documents with small text, 200 KB at A4-scan size keeps text readable. If the form needs a PDF instead, use JPG to PDF after compressing.',
    faq: { q: 'Will text in my scan stay readable?', a: 'Usually yes at 200 KB. If small print looks soft, crop away the margins first so more of the size budget goes to the text.' },
  },
};

export function compressToLanding(kb: 20 | 50 | 100 | 200): Landing {
  const c = SIZE_COPY[kb];
  const others = ([20, 50, 100, 200] as const).filter((x) => x !== kb).map((x) => `compress-to-${x}kb`);
  return {
    id: `compress-to-${kb}kb`,
    metaTitle: `Compress Image to ${kb}KB Online – Free, JPG Under ${kb} KB`,
    metaDescription: `Compress a photo to under ${kb} KB free, for ${c.use}. Best possible quality, no upload, works on phone and PC.`,
    h1: `Compress Image to ${kb}KB`,
    subtitle: c.intro,
    chips: ['100% free', `Always under ${kb} KB`, 'No upload', 'Works on phone'],
    privacy: 'browser',
    privacyNote: 'Your photo is compressed inside your browser. It is never uploaded to a server.',
    stepsTitle: `How to reduce a photo to ${kb} KB`,
    steps: [
      { title: 'Add your photo', desc: 'Drop a JPG, PNG, HEIC or WebP photo, or several at once.' },
      { title: `Keep ${kb} KB or set another size`, desc: 'The target is already set. Change it if your form asks for a different limit.' },
      { title: 'Compress and download', desc: `The tool finds the highest quality that fits under ${kb} KB. Download it and upload it to your form.` },
    ],
    sections: [
      { title: `What ${kb} KB images are used for`, bullets: c.uses },
      {
        title: 'How it gets your photo under the limit',
        paragraphs: [
          `The tool tries JPG quality levels until it finds the highest one that stays under ${kb} KB. If the photo is too large even at low quality, it gently reduces the dimensions and tries again, so you never get a smeared, blocky result.`,
          'The final size, dimensions and quality are shown next to each file, so you can check it against the form’s rules before uploading.',
        ],
      },
      { title: 'Tip for the best result', paragraphs: [c.tip] },
    ],
    faqs: [
      { q: `How do I compress a photo to ${kb} KB?`, a: `Add the photo, keep the target at ${kb} KB and click Compress. Download the result; it is guaranteed to be under ${kb} KB.` },
      c.faq,
      { q: 'Which format should I choose?', a: 'JPG. Almost every upload form accepts JPG. Choose WebP only for websites.' },
      { q: 'What if my photo is already smaller?', a: `If it is already a JPG under ${kb} KB, it is kept exactly as it is.` },
      { q: 'Is my photo uploaded?', a: 'No. Everything happens in your browser, which matters for ID photos and signatures.' },
    ],
    related: [...others, 'image-resizer', 'image-compressor', 'jpg-to-pdf'],
  };
}
