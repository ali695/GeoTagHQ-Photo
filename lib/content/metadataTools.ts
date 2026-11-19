import type { Landing } from './landing';

export const EXIF_VIEWER: Landing = {
  id: 'exif-viewer',
  metaTitle: 'EXIF Viewer Online – See Photo Metadata & GPS Free',
  metaDescription: 'View EXIF data online free: camera, lens, settings, date taken, GPS location on a map and every hidden tag. Supports JPG, HEIC, PNG, WebP. Nothing uploaded.',
  h1: 'EXIF Viewer: See All Hidden Photo Metadata',
  subtitle: 'Drop a photo to see the camera, lens, exposure settings, date taken, GPS location on a map and every EXIF, XMP and IPTC tag inside it.',
  chips: ['100% free', 'JPG, HEIC, PNG, WebP', 'GPS on a map', 'Never uploaded'],
  privacy: 'browser',
  privacyNote: 'The photo is read in your browser and never uploaded. Only the GPS coordinates (if any) are sent to look up the street address.',
  stepsTitle: 'How to view EXIF data',
  steps: [
    { title: 'Add a photo', desc: 'Drop a JPG, iPhone HEIC, PNG, WebP or AVIF image, or click to choose one.' },
    { title: 'Read the summary', desc: 'See camera, lens, exposure, date, dimensions and software at a glance, plus the location on a map.' },
    { title: 'Explore every tag', desc: 'Search the full list of metadata fields, grouped by type, and export them as JSON.' },
  ],
  sections: [
    {
      title: 'What is EXIF data?',
      paragraphs: [
        'EXIF (Exchangeable Image File Format) is information your camera or phone saves inside every photo: the device, lens, shutter speed, aperture, ISO, date and time, image size and often the exact GPS location.',
        'Photos can also carry XMP and IPTC metadata, added by editing software or photographers, such as titles, captions, keywords, copyright and author.',
      ],
    },
    {
      title: 'What you can learn from a photo’s metadata',
      bullets: [
        'Where it was taken: GPS latitude, longitude and altitude, shown on a map with the street address.',
        'When it was taken: original date and time, plus when it was edited.',
        'What took it: camera or phone model, lens and software version.',
        'How it was taken: aperture, shutter speed, ISO, focal length and flash.',
        'Who owns it: author and copyright fields, if the photographer added them.',
      ],
    },
    {
      title: 'Why some photos have no EXIF data',
      paragraphs: [
        'Facebook, Instagram, WhatsApp, X and most other platforms remove EXIF data when you upload a photo, so images downloaded from them usually have little or none. Screenshots and many edited images also have minimal metadata.',
      ],
    },
  ],
  faqs: [
    { q: 'Is it safe to check EXIF data here?', a: 'Yes. The photo is read in your browser using exifr and never uploaded. If it contains GPS, only the coordinates are sent to look up the street address.' },
    { q: 'Can I see EXIF data of iPhone HEIC photos?', a: 'Yes. HEIC metadata is read directly, including GPS, date and camera details.' },
    { q: 'How do I view EXIF data on Windows or Mac without a tool?', a: 'On Windows, right-click the photo, choose Properties and open the Details tab. On a Mac, open it in Preview and choose Tools › Show Inspector. Both show only some fields; this viewer shows all of them.' },
    { q: 'Can I edit or remove EXIF data?', a: 'Yes, with our other free tools: add a GPS location with the Geo Tagging Tool, or strip all metadata with Remove EXIF Data.' },
    { q: 'What does “Maker note” mean?', a: 'It is a manufacturer-specific block of data that cameras store in their own format. Its contents vary by brand.' },
  ],
  related: ['photo-location-finder', 'remove-exif', 'geotag', 'lat-long-finder', 'heic-to-jpg', 'image-compressor'],
};

export const PHOTO_LOCATION_FINDER: Landing = {
  id: 'photo-location-finder',
  metaTitle: 'Photo Location Finder – Where Was This Photo Taken?',
  metaDescription: 'Find where a photo was taken from its GPS data. See the exact spot on a map with the street address. Works with iPhone and Android photos. Free and private.',
  h1: 'Photo Location Finder: Where Was This Photo Taken?',
  subtitle: 'Upload a photo to see the exact place it was taken on a map, with the street address and coordinates, using the GPS data stored inside it.',
  chips: ['100% free', 'iPhone & Android photos', 'Map + street address', 'Never uploaded'],
  privacy: 'browser',
  privacyNote: 'The photo is read in your browser and never uploaded. Only the GPS coordinates are sent to look up the street address.',
  stepsTitle: 'How to find where a photo was taken',
  steps: [
    { title: 'Add the photo', desc: 'Use the original file from the phone or camera. Photos downloaded from social media usually have their location removed.' },
    { title: 'See it on the map', desc: 'If the photo has GPS data, the exact spot appears on the map with the street address and coordinates.' },
    { title: 'Open or share it', desc: 'Copy the coordinates, open the spot in Google Maps, or remove the location before sharing.' },
  ],
  sections: [
    {
      title: 'How photo location finding works',
      paragraphs: [
        'When location services are on, phones save the GPS position in each photo’s EXIF metadata. This tool reads those coordinates and places them on a map. It does not guess from what is in the picture.',
        'Accuracy is usually within 5–20 metres outdoors, and can be worse indoors or in dense cities where GPS signal bounces off buildings.',
      ],
    },
    {
      title: 'Why a photo might show no location',
      bullets: [
        'Location access for the camera app was turned off when the photo was taken.',
        'The photo was sent through WhatsApp, Facebook, Instagram, X or similar, which strip GPS data.',
        'It is a screenshot, a scan, or an image saved from a website.',
        'Someone removed the metadata before sharing it.',
      ],
    },
    {
      title: 'Protect your own location',
      paragraphs: [
        'If you share original photo files by email, cloud links or AirDrop, the GPS location usually goes with them. That can reveal your home or children’s school. Use our Remove EXIF Data tool to strip the location before sharing.',
      ],
    },
  ],
  faqs: [
    { q: 'Can this find the location of any photo?', a: 'Only photos that still contain GPS metadata. It reads the coordinates saved by the phone or camera. It can’t work out a location from the image content.' },
    { q: 'Does it work with iPhone photos?', a: 'Yes, including HEIC files. Use the original photo, not one saved from social media or a messaging app.' },
    { q: 'Why does WhatsApp remove the location?', a: 'WhatsApp, Facebook, Instagram and most platforms strip EXIF data from shared images to protect privacy.' },
    { q: 'Is my photo uploaded?', a: 'No. It is read in your browser. Only the coordinates are sent to our server to look up the street address from OpenStreetMap.' },
    { q: 'How accurate is the location?', a: 'Usually within 5–20 metres outdoors. Indoors or between tall buildings it can be off by more.' },
  ],
  related: ['exif-viewer', 'remove-exif', 'lat-long-finder', 'geotag', 'heic-to-jpg', 'image-converter'],
};

export const REMOVE_EXIF: Landing = {
  id: 'remove-exif',
  metaTitle: 'Remove EXIF Data & Location from Photos – Free, Online',
  metaDescription: 'Remove GPS location and EXIF metadata from photos free. Lossless for JPG, PNG and WebP, batch up to 20 photos, verified clean. Runs in your browser, nothing uploaded.',
  h1: 'Remove EXIF Data and Location from Photos',
  subtitle: 'Strip GPS location, camera details, dates and all other hidden metadata from your photos before you share them. Lossless, verified, and done in your browser.',
  chips: ['100% free', 'Lossless for JPG, PNG, WebP', 'Batch up to 20', 'Never uploaded'],
  privacy: 'browser',
  privacyNote: 'Metadata is removed in your browser. Your photos are never uploaded to any server.',
  stepsTitle: 'How to remove EXIF data from a photo',
  steps: [
    { title: 'Add photos', desc: 'Drop up to 20 photos. You’ll see what each one contains, including any GPS location.' },
    { title: 'Remove metadata', desc: 'Click Remove metadata. JPG, PNG and WebP files are cleaned without re-compressing the image.' },
    { title: 'Download clean files', desc: 'Each file is re-checked to confirm no metadata is left. Download one by one or as a ZIP.' },
  ],
  sections: [
    {
      title: 'Why remove EXIF data before sharing?',
      bullets: [
        'GPS coordinates can reveal your home, workplace or your children’s school.',
        'Date and time show when you were somewhere.',
        'Camera serial numbers and software can link photos back to you.',
        'Sellers on marketplaces and people sharing photos of their homes are common targets.',
      ],
    },
    {
      title: 'Lossless removal: the image itself is untouched',
      paragraphs: [
        'Most EXIF removers re-save the whole image, which lowers its quality a little every time. For JPG, PNG and WebP, this tool removes only the metadata blocks from the file and leaves the image data exactly as it was.',
        'Two exceptions: photos that rely on a rotation tag are re-saved upright (otherwise they would appear sideways once the tag is gone), and iPhone HEIC photos are saved as JPG, because browsers can’t write HEIC files.',
      ],
    },
    {
      title: 'What gets removed',
      bullets: [
        'EXIF: GPS location, camera make and model, lens, settings, dates, software, serial numbers and thumbnail.',
        'XMP: editing history, ratings, keywords and location data added by apps like Lightroom.',
        'IPTC: captions, author, copyright and contact details.',
        'Comments and PNG text chunks.',
        'Kept: the colour profile (ICC), so colours look the same as before.',
      ],
    },
  ],
  faqs: [
    { q: 'Does removing EXIF data reduce image quality?', a: 'Not for JPG, PNG or WebP: only metadata is removed and the image data is copied unchanged. Rotated photos and HEIC files are re-saved at 95% quality.' },
    { q: 'How do I know the metadata is really gone?', a: 'After cleaning, the tool reads the new file again and shows “Verified: no metadata or GPS left”. You can double-check with our EXIF Viewer.' },
    { q: 'Do social media sites remove EXIF data anyway?', a: 'Facebook, Instagram, WhatsApp and X strip most metadata on upload, but email attachments, cloud links, AirDrop, forums and many websites keep it.' },
    { q: 'How do I stop my phone adding location to photos?', a: 'On iPhone: Settings › Privacy & Security › Location Services › Camera › Never. On Android: open the Camera app settings and turn off location tags.' },
    { q: 'Are my photos uploaded?', a: 'No. Everything happens in your browser.' },
  ],
  related: ['exif-viewer', 'photo-location-finder', 'geotag', 'image-compressor', 'heic-to-jpg', 'image-converter'],
};
