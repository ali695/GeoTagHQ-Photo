import type { Landing } from './landing';

export const IMAGE_COMPRESSOR: Landing = {
  id: 'image-compressor',
  metaTitle: 'Image Compressor – Reduce JPG, PNG & WebP Size Free',
  metaDescription: 'Compress images online free. Reduce JPG, PNG and WebP file size by up to 80% with no visible quality loss. Batch up to 20, resize, convert to WebP. No sign-up.',
  h1: 'Image Compressor: Make Images Smaller Without Losing Quality',
  subtitle: 'Shrink JPG, PNG, WebP and iPhone photos for faster websites, email and uploads. Pick a level, resize if you like, and download.',
  chips: ['100% free', 'JPG, PNG, WebP, HEIC', 'Batch up to 20', 'No watermark'],
  privacy: 'mixed',
  privacyNote: 'JPG and WebP are compressed in your browser. PNG files kept as PNG are compressed on our server in memory and never stored.',
  stepsTitle: 'How to compress an image',
  steps: [
    { title: 'Add images', desc: 'Drop up to 20 JPG, PNG, WebP or HEIC images.' },
    { title: 'Choose a level', desc: 'Balanced suits most photos. Optionally convert to WebP or cap the width.' },
    { title: 'Download', desc: 'See how much each image shrank and download one by one or as a ZIP.' },
  ],
  sections: [
    {
      title: 'Why compress images?',
      bullets: [
        'Images are usually the heaviest part of a web page. Smaller images mean faster loading and better Core Web Vitals.',
        'Email providers and upload forms often limit attachment size.',
        'Google Business Profile, marketplaces and CMSs process smaller images faster.',
        'Less storage and bandwidth for you and your visitors.',
      ],
    },
    {
      title: 'Getting the smallest files',
      bullets: [
        'Resize first: a 4000 px photo displayed at 1200 px wide wastes most of its bytes. The Max width option fixes that.',
        'Use WebP for websites: it’s typically 25–35% smaller than JPG at similar quality.',
        'Keep PNG for logos, screenshots and graphics with text; use JPG or WebP for photos.',
        'Quality 70–80% is the sweet spot for photos. Below 60% you may start to see blocky areas.',
      ],
    },
    {
      title: 'How PNG compression works',
      paragraphs: [
        'PNG is lossless, so browsers can’t make it much smaller on their own. When you keep a PNG as PNG, our server reduces it to an optimised colour palette, the same technique popular PNG compressors use, which often cuts size by 60–80% with little visible change. The file is processed in memory and not stored.',
      ],
    },
  ],
  faqs: [
    { q: 'How much smaller will my images be?', a: 'Typical photos shrink 40–80%, depending on the original and the level you choose. Resizing large camera photos saves the most.' },
    { q: 'Will compression reduce quality?', a: 'At the Balanced setting most people can’t tell the difference. If a result is ever larger than the original, the tool keeps your original file.' },
    { q: 'Are my images uploaded?', a: 'JPG, WebP and HEIC are compressed in your browser. Only PNG-to-PNG compression uses our server, which processes the file in memory and doesn’t store it.' },
    { q: 'Does compressing remove EXIF data?', a: 'Yes, compressed files are saved without EXIF metadata such as GPS location, which also makes them a little smaller.' },
    { q: 'Is there a limit?', a: 'Up to 20 images at a time, 25 MB each. There is no daily limit.' },
  ],
  related: ['jpg-to-webp', 'png-to-webp', 'image-converter', 'remove-exif', 'exif-viewer', 'heic-to-jpg'],
};

export const LAT_LONG_FINDER: Landing = {
  id: 'lat-long-finder',
  metaTitle: 'Lat Long Finder – Get Coordinates for Any Address',
  metaDescription: 'Find latitude and longitude for any address or place. Click the map, search or use your location. Copy decimal or DMS coordinates and convert coordinates to an address.',
  h1: 'Lat Long Finder: Get Latitude & Longitude for Any Address',
  subtitle: 'Search an address, click the map or use your location to get exact GPS coordinates in decimal and degrees, minutes, seconds, ready to copy.',
  chips: ['100% free', 'Address ↔ coordinates', 'Decimal & DMS', 'Street & satellite map'],
  privacy: 'server',
  privacyNote: 'Searches and map clicks are sent to our mapping provider to look up places and addresses. We don’t store them.',
  stepsTitle: 'How to find latitude and longitude',
  steps: [
    { title: 'Search or click', desc: 'Type an address, business or landmark, click anywhere on the map, or use your current location.' },
    { title: 'Fine-tune the pin', desc: 'Drag the pin to the exact spot. Switch to satellite view to see buildings and entrances.' },
    { title: 'Copy coordinates', desc: 'Copy latitude and longitude in decimal or DMS, or open the spot in Google Maps.' },
  ],
  sections: [
    {
      title: 'Latitude and longitude explained',
      paragraphs: [
        'Latitude measures how far north or south of the equator a place is, from −90° to +90°. Longitude measures how far east or west of the Greenwich meridian it is, from −180° to +180°. Together they pinpoint any spot on Earth.',
        'Coordinates are written as decimal degrees (33.684400, 73.047900) or as degrees, minutes and seconds (33°41\'03.8" N 73°02\'52.4" E). Most apps and websites use decimal degrees.',
      ],
    },
    {
      title: 'How precise are the coordinates?',
      bullets: [
        '4 decimal places ≈ 11 metres: enough for a street.',
        '5 decimal places ≈ 1.1 metres: enough for a building entrance.',
        '6 decimal places ≈ 11 centimetres: more than GPS can usually measure.',
      ],
    },
    {
      title: 'Common uses',
      bullets: [
        'Adding a precise location to a Google Business Profile, directory listing or delivery app.',
        'Sharing a meeting point or site location with customers or crews.',
        'Geotagging photos: paste the coordinates into our Geo Tagging Tool.',
        'Checking what is at coordinates someone sent you.',
      ],
    },
  ],
  faqs: [
    { q: 'How do I get coordinates for an address?', a: 'Type the address in the search box on the map and choose it from the list. The latitude and longitude appear in the panel, ready to copy.' },
    { q: 'How do I find the address for coordinates?', a: 'Paste the coordinates into the search box or the "Find coordinates on the map" box. The pin moves there and the nearest address is shown.' },
    { q: 'Which format should I use?', a: 'Decimal degrees (e.g. 33.684400, 73.047900) work in Google Maps, most apps and spreadsheets. DMS is common on paper maps and in aviation.' },
    { q: 'Why is a negative number shown?', a: 'Negative latitude means south of the equator; negative longitude means west of Greenwich.' },
    { q: 'Can I get my current coordinates?', a: 'Yes. Click the locate button on the map and allow location access in your browser.' },
  ],
  related: ['geotag', 'photo-location-finder', 'exif-viewer', 'remove-exif', 'image-converter', 'image-compressor'],
};

export const AI_ALT_TEXT: Landing = {
  id: 'ai-alt-text',
  metaTitle: 'AI Alt Text Generator – Free SEO Alt Text from Images',
  metaDescription: 'Generate accessible, SEO-friendly alt text from any image with AI. Add a focus keyword, choose from 14 languages, get captions and SEO file names. Free.',
  h1: 'AI Alt Text Generator for SEO and Accessibility',
  subtitle: 'Upload an image and get accurate, keyword-aware alt text in seconds, plus two alternatives, a caption and an SEO-friendly file name.',
  chips: ['Free (15 images/hour)', '14 languages', 'Keyword-aware', 'Caption + file name'],
  privacy: 'ai',
  privacyNote: 'A reduced copy of each image (max 1024 px) is sent to Google’s Gemini AI to write the description. We don’t store your images.',
  stepsTitle: 'How to generate alt text',
  steps: [
    { title: 'Add images', desc: 'Drop up to 10 JPG, PNG, WebP or HEIC images.' },
    { title: 'Add context', desc: 'Optionally enter a focus keyword and what the page is about, and pick a language.' },
    { title: 'Copy the result', desc: 'Copy the alt text, an alternative, the caption, the SEO file name or a ready-made HTML tag.' },
  ],
  sections: [
    {
      title: 'What makes good alt text?',
      bullets: [
        'Describes what is actually in the image, in the context of the page.',
        'Is concise: around 80–125 characters, so screen readers don’t cut it off.',
        'Skips “image of” or “picture of”: screen readers already announce it’s an image.',
        'Uses a keyword only where it honestly describes the image. Keyword stuffing hurts accessibility and can hurt SEO.',
        'Is empty (alt="") for purely decorative images, so screen readers skip them.',
      ],
    },
    {
      title: 'Why alt text matters for SEO',
      paragraphs: [
        'Search engines use alt text to understand images, which helps them appear in Google Images and gives context to the page. Google’s own guidelines recommend descriptive, useful alt text that fits the context.',
        'Alt text is first an accessibility feature: it is what blind and low-vision visitors hear. Writing it well for people is also what works best for search.',
      ],
    },
    {
      title: 'Check before you publish',
      paragraphs: [
        'AI is good at describing what it can see, but it doesn’t know your business. It won’t know the name of your shop, product or the person in the photo unless you add that context. Always read the suggestion and adjust details before publishing.',
      ],
    },
  ],
  faqs: [
    { q: 'Is the AI alt text generator free?', a: 'Yes. You can generate alt text for up to 15 images per hour, with no sign-up.' },
    { q: 'Which AI is used?', a: 'Google’s Gemini model. A downscaled copy of your image is sent to it to write the description.' },
    { q: 'Do you store my images?', a: 'No. Images are sent to the AI for processing and not saved by us.' },
    { q: 'How long should alt text be?', a: 'Aim for about 80–125 characters. Long descriptions belong in a caption or the surrounding text.' },
    { q: 'Should I put keywords in alt text?', a: 'Only when they genuinely describe the image. The generator includes your keyword only where it fits naturally.' },
    { q: 'Can it write alt text in other languages?', a: 'Yes: choose from 14 languages including Spanish, German, French, Arabic, Hindi and Urdu.' },
  ],
  related: ['image-compressor', 'jpg-to-webp', 'geotag', 'remove-exif', 'exif-viewer', 'image-converter'],
};
