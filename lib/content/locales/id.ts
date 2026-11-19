import type { ToolPageContent } from '../toolPage';

// Natively written for Indonesian searchers. Target phrases:
// "cara menambahkan lokasi di foto", "geotag foto online gratis", "menambahkan koordinat GPS ke foto",
// "foto geotag", "edit EXIF foto", "Profil Bisnis Google".
const id: ToolPageContent = {
  metaTitle: 'Geotag Foto Online Gratis: Tambahkan Lokasi GPS ke Foto',
  metaDescription:
    'Cara mudah menambahkan lokasi di foto: koordinat GPS, judul, dan data usaha ke JPG, PNG, WebP, dan HEIC. Gratis, tanpa daftar, tanpa watermark.',

  eyebrow: 'Gratis · Tanpa daftar · Tanpa watermark',
  h1: 'Geotag Foto Online Gratis: Tambahkan Lokasi GPS ke Foto Anda',
  subtitle:
    'Pilih titik di peta, isi data usaha Anda, lalu unduh foto dengan koordinat GPS yang sudah tertulis di data EXIF. Bisa untuk JPG, PNG, WebP, HEIC, dan lainnya, hingga 10 foto sekaligus.',
  trustChips: ['100% gratis', 'Hingga 10 foto sekaligus', 'Foto tidak disimpan', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Geotag foto sekarang',
  ctaSecondary: 'Cara kerjanya',

  stepsTitle: 'Cara menambahkan lokasi di foto dalam 4 langkah',
  stepsIntro: 'Tidak perlu Lightroom, ExifTool, atau aplikasi apa pun. Semuanya dilakukan di halaman ini.',
  steps: [
    { title: 'Unggah foto', desc: 'Seret hingga 10 gambar, atau tempel URL halaman web untuk mengambil gambarnya. Data EXIF yang sudah ada langsung terlihat.' },
    { title: 'Tentukan lokasi', desc: 'Cari alamat, nama usaha, atau tempat terkenal, geser penanda di peta, atau ketik lintang dan bujur secara manual.' },
    { title: 'Isi data usaha', desc: 'Tulis judul, deskripsi, kata kunci, dan nama usaha. Alamat, kota, dan kode pos terisi otomatis dari peta.' },
    { title: 'Terapkan dan unduh', desc: 'Pilih format dan kompresi, klik terapkan, lalu unduh foto satu per satu atau semuanya dalam satu file ZIP.' },
  ],

  featuresTitle: 'Semua yang Anda butuhkan untuk geotag foto',
  featuresIntro: 'Dibuat untuk pemilik usaha, agensi SEO, agen properti, dan fotografer yang perlu menambahkan lokasi ke foto dengan cepat.',
  features: [
    { title: 'Cari di peta', desc: 'Temukan jalan, kota, tempat, atau usaha apa pun, lalu geser penanda ke titik yang tepat.' },
    { title: 'Koordinat persis', desc: 'Ketik lintang dan bujur sendiri jika Anda sudah tahu lokasinya.' },
    { title: 'Banyak foto sekaligus', desc: 'Beri lokasi yang sama untuk hingga 10 foto, atau ubah metadata satu foto saja.' },
    { title: 'Metadata untuk SEO lokal', desc: 'Tulis judul, deskripsi, kata kunci, dan nama usaha ke kolom EXIF yang terlihat di Windows dan kebanyakan aplikasi foto.' },
    { title: 'Konversi dan kompres', desc: 'Ekspor ke JPG, PNG, WebP, AVIF, atau TIFF dan perkecil ukuran file agar website lebih cepat.' },
    { title: 'Ambil dari URL', desc: 'Ambil gambar dari halaman publik atau tautan gambar langsung tanpa harus mengunduhnya dulu.' },
    { title: 'Potong dan edit', desc: 'Potong foto dengan rasio tetap atau bebas sebelum menambahkan lokasi.' },
  ],

  metadataTitle: 'Data EXIF apa saja yang ditulis ke foto Anda',
  metadataIntro: 'Geotag berarti menyimpan lokasi di dalam file foto itu sendiri, yaitu di metadata EXIF. Inilah yang ditulis PinPixl:',
  metadataHeaders: ['Data', 'Kolom EXIF', 'Contoh'],
  metadataRows: [
    { field: 'Lokasi GPS', example: '6.9175° LS, 107.6191° BT' },
    { field: 'Judul', example: 'Kopi susu gula aren di kedai kami di Bandung' },
    { field: 'Deskripsi', example: 'Suasana pagi di kedai kopi kami di Jalan Braga.' },
    { field: 'Kata kunci', example: 'kedai kopi, kopi susu, Bandung' },
    { field: 'Nama usaha', example: 'Nama usaha Anda' },
    { field: 'Kota, negara, dan lainnya', example: 'City: Bandung; Country: Indonesia' },
    { field: 'Tanggal foto, kamera', example: '2026:11:18 08:00:00' },
  ],
  metadataNote: 'JPG memberi hasil paling andal. Format lain dikonversi, dan terbaca atau tidaknya beberapa kolom tergantung platform tempat Anda mengunggah foto.',

  useCasesTitle: 'Siapa yang butuh geotag foto?',
  useCases: [
    { title: 'Usaha dengan Profil Bisnis Google', desc: 'Siapkan foto toko, tim, dan hasil kerja dengan data lokasi yang konsisten sebelum diunggah.' },
    { title: 'Agensi SEO dan digital marketing', desc: 'Tambahkan geotag ke foto klien secara massal dengan nama, kata kunci, dan alamat yang tepat untuk tiap cabang.' },
    { title: 'Agen properti', desc: 'Catat lokasi pengambilan setiap foto properti agar iklan dan arsip tetap rapi.' },
    { title: 'Kontraktor dan jasa servis', desc: 'Buktikan di mana pekerjaan dilakukan: foto sebelum dan sesudah membawa lokasi proyek.' },
    { title: 'Fotografer dan traveler', desc: 'Beri lokasi pada foto dari kamera tanpa GPS agar muncul di peta Google Foto, Apple Foto, atau Lightroom.' },
    { title: 'Pemilik website', desc: 'Kompres dan konversi gambar supaya halaman lebih cepat tanpa kehilangan metadata yang berguna.' },
  ],

  seoTitle: 'Apakah geotag foto membantu SEO lokal? Jawaban jujurnya',
  seoParagraphs: [
    'Geotag sering dijual sebagai trik naik peringkat. Kenyataannya tidak begitu. Google tidak pernah mengonfirmasi bahwa data GPS di dalam foto adalah faktor peringkat, dan foto di Profil Bisnis Google dihapus data EXIF-nya saat dipublikasikan.',
    'Lalu untuk apa geotag? Karena data lokasi membuat arsip foto Anda rapi, membantu aplikasi foto dan peta menempatkan gambar dengan benar, dan menambah satu data lokasi yang konsisten pada file yang Anda pasang di website sendiri dan di direktori. Anggap ini kebiasaan baik yang mendukung SEO lokal, bukan penggantinya.',
    'Yang benar-benar berpengaruh untuk pencarian lokal adalah hal yang dilihat orang dan Google: foto asli usaha Anda, nama file yang jelas, teks alternatif yang berguna, serta nama, alamat, dan nomor telepon yang sama di mana pun.',
  ],
  seoChecklistTitle: 'Checklist SEO lokal untuk gambar',
  seoChecklist: [
    'Gunakan foto asli tempat usaha, tim, dan hasil kerja. Hindari foto stok.',
    'Beri nama file yang deskriptif, misalnya kedai-kopi-braga-bandung.jpg, bukan IMG_4521.jpg.',
    'Tulis teks alternatif yang menjelaskan isi foto, bukan deretan kata kunci.',
    'Kompres gambar agar halaman cepat terbuka di HP.',
    'Unggah foto baru ke Profil Bisnis Google secara rutin.',
    'Pastikan nama, alamat, dan nomor telepon sama persis di website dan semua direktori.',
  ],

  privacyTitle: 'Apa yang kami lakukan dengan foto Anda',
  privacyParagraphs: [
    'Untuk menulis metadata dan mengonversi format, foto Anda dikirim melalui koneksi terenkripsi ke server kami, diproses di memori, lalu dikembalikan sebagai unduhan. Kami tidak menyimpan foto Anda, tidak membuat salinan, dan tidak memakainya untuk hal lain.',
    'Tidak ada akun, jadi tidak ada yang menghubungkan foto dengan Anda. Pencarian lokasi memakai data peta publik.',
  ],

  formatsTitle: 'Format gambar yang didukung',
  formats: [
    { format: 'JPG / JPEG', support: 'Penuh', note: 'Pilihan terbaik. GPS dan semua kolom teks didukung di mana saja.' },
    { format: 'PNG', support: 'Baik', note: 'GPS tertulis, tetapi beberapa situs dan aplikasi mengabaikan metadata PNG.' },
    { format: 'WebP', support: 'Baik', note: 'File ringan untuk website. Dukungan metadata berbeda-beda tiap platform.' },
    { format: 'HEIC / HEIF', support: 'Dikonversi', note: 'Foto iPhone. Ekspor ke JPG untuk kompatibilitas terluas.' },
    { format: 'AVIF, TIFF', support: 'Dikonversi', note: 'Diterima dan diekspor. Cek apakah platform Anda membaca metadatanya.' },
  ],

  faqTitle: 'Pertanyaan umum tentang geotag foto',
  faqSubtitle: 'Jawaban seputar GPS, data EXIF, dan metadata gambar.',
  faqs: [
    { q: 'Bagaimana cara menambahkan lokasi di foto?', a: 'Unggah foto di atas, cari alamat atau geser penanda di peta, lalu klik terapkan. Alat ini menulis koordinat ke data EXIF dan Anda tinggal mengunduh foto yang sudah ber-geotag. Kurang dari satu menit, tanpa instal apa pun.' },
    { q: 'Apakah alat ini benar-benar gratis?', a: 'Ya. Tanpa daftar, tanpa watermark, dan tanpa paket berbayar. Anda bisa memproses hingga 10 foto sekaligus, masing-masing maksimal 10 MB.' },
    { q: 'Apakah geotag foto menaikkan peringkat di Google?', a: 'Tidak secara langsung. Google belum pernah mengonfirmasi data GPS pada gambar sebagai faktor peringkat, dan Profil Bisnis Google menghapus data EXIF dari foto yang dipublikasikan. Geotag berguna untuk merapikan arsip dan menjaga data tetap konsisten, tetapi foto asli, nama file yang baik, dan teks alternatif lebih berpengaruh.' },
    { q: 'Perlukah geotag foto sebelum diunggah ke Profil Bisnis Google?', a: 'Tidak ada ruginya dan membuat file asli Anda tetap rapi, tetapi jangan berharap peringkat naik hanya karena itu. Yang lebih penting adalah rutin mengunggah foto asli, terbaru, dan berkualitas.' },
    { q: 'Bagaimana cara edit EXIF foto secara online?', a: 'Di PinPixl Anda bisa mengubah lokasi GPS, judul, deskripsi, kata kunci, nama usaha, tanggal, dan kamera lewat formulir, lalu mengunduh file dengan data EXIF baru, tanpa instal program.' },
    { q: 'Apakah foto saya disimpan?', a: 'Tidak. Foto hanya diproses di memori server kami untuk menulis metadata dan mengonversi format, lalu dikembalikan kepada Anda. Foto tidak disimpan dan tidak dibagikan.' },
    { q: 'Bagaimana cara cek apakah foto sudah punya lokasi GPS?', a: 'Unggah foto ke alat ini dan metadatanya langsung terlihat. Di Windows, klik kanan file, pilih Properties lalu Details. Di Mac, buka dengan Preview lalu pilih Tools › Show Inspector.' },
    { q: 'Bisakah menambahkan lokasi ke foto HEIC dari iPhone?', a: 'Bisa. File HEIC dan HEIF didukung. Untuk kompatibilitas terbaik, ekspor ke JPG.' },
    { q: 'Bisakah geotag banyak foto sekaligus?', a: 'Bisa. Unggah hingga 10 foto, pilih satu lokasi, terapkan ke semuanya, lalu unduh sekaligus dalam file ZIP. Anda tetap bisa mengedit tiap foto secara terpisah.' },
    { q: 'Apakah kualitas foto akan turun?', a: 'Tidak, kecuali Anda memilih kompresi atau format lain. Dengan kompresi Tidak Ada dan format asli, hanya metadata yang berubah.' },
  ],

  finalCtaTitle: 'Siap menambahkan lokasi ke foto Anda?',
  finalCtaText: 'Gratis, tanpa daftar, dan selesai dalam waktu kurang dari semenit.',
  finalCtaButton: 'Mulai sekarang',
};

export default id;
