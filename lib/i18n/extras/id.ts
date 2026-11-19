import type { ToolExtras } from '../types';

// Indonesian long-form sections, written natively.
const id: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'Apa itu data EXIF?',
        paragraphs: [
          'EXIF adalah singkatan dari “Exchangeable Image File Format”. Setiap kali Anda memotret, kamera atau HP menyimpan info tersembunyi di dalam file: merek dan tipe perangkat, lensa, bukaan, kecepatan rana, ISO, tanggal dan jam — dan kalau lokasi aktif, juga koordinat GPS yang persis.',
          'Sering juga ada data XMP dan IPTC dari Lightroom, Photoshop, atau aplikasi lain: judul, keterangan, kata kunci, nama fotografer, dan hak cipta. Penampil ini menampilkan semuanya sekaligus, jauh lebih lengkap daripada beberapa kolom di “Properties” Windows.',
        ],
      },
      {
        title: 'Kenapa ada foto yang tidak punya metadata?',
        paragraphs: [
          'Foto yang diunggah ke WhatsApp, Facebook, Instagram, atau X hampir selalu dihapus metadatanya, demi privasi dan supaya hemat ruang. Jadi gambar yang Anda simpan dari chat biasanya sudah tidak punya info kamera maupun lokasi.',
          'Screenshot, dokumen hasil scan, dan banyak gambar yang sudah diedit juga nyaris tidak punya EXIF. Kalau ingin tahu isi asli sebuah foto, selalu gunakan file aslinya dari HP atau kamera.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Seberapa akurat lokasi di foto?',
        paragraphs: [
          'Alat ini membaca koordinat GPS yang disimpan HP saat foto diambil; alat ini tidak menebak tempat dari isi gambar. Di luar ruangan, titik yang tersimpan biasanya meleset sekitar 5–20 meter dari lokasi sebenarnya.',
          'Di dalam gedung, di gang sempit di antara gedung tinggi, atau tepat setelah HP dinyalakan, selisihnya bisa lebih besar karena sinyal GPS lemah atau memantul. Pakai tampilan satelit untuk cepat mengecek apakah titiknya masuk akal.',
        ],
      },
      {
        title: 'Lindungi lokasi Anda sendiri',
        paragraphs: [
          'Yang berguna untuk melacak lokasi foto orang lain juga bisa berbalik ke Anda: siapa pun yang menerima foto asli Anda lewat email, link cloud, atau AirDrop bisa melihat persis di mana rumah Anda atau sekolah anak Anda.',
          'Sebelum pasang iklan di OLX, jualan di Tokopedia atau Shopee, atau membagikan foto rumah, hapus lokasinya dengan alat “Hapus data EXIF” kami. Cuma butuh beberapa detik.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Tanpa mengurangi kualitas',
        paragraphs: [
          'Banyak alat online menyimpan ulang seluruh gambar, sehingga kualitasnya turun sedikit setiap kali. Untuk JPG, PNG, dan WebP, kami hanya memotong blok metadata dari file; data gambarnya tetap sama persis.',
          'Ada dua pengecualian: foto yang tampil tegak hanya karena tag orientasi akan disimpan ulang dalam posisi tegak (kalau tidak, foto akan miring setelah tag dihapus), dan foto HEIC dari iPhone disimpan sebagai JPG karena browser tidak bisa menulis HEIC.',
        ],
      },
      {
        title: 'Apa saja yang dihapus',
        bullets: [
          'EXIF: lokasi GPS, tipe kamera, lensa, pengaturan foto, tanggal, software, nomor seri, dan thumbnail.',
          'XMP: riwayat edit, rating, kata kunci, dan data lokasi dari aplikasi seperti Lightroom.',
          'IPTC: keterangan, nama fotografer, hak cipta, dan kontak.',
          'Komentar dan potongan teks di file PNG.',
          'Profil warna (ICC) tetap dipertahankan, jadi warnanya tidak berubah.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Lintang dan bujur, penjelasan singkat',
        paragraphs: [
          'Lintang (latitude) menunjukkan seberapa jauh suatu tempat di utara atau selatan khatulistiwa (−90° sampai +90°). Bujur (longitude) menunjukkan seberapa jauh di timur atau barat garis Greenwich (−180° sampai +180°). Keduanya membentuk titik koordinat suatu lokasi.',
          'Ada dua cara penulisan: derajat desimal, seperti -6.200000, 106.816666, format yang dipakai Google Maps dan kebanyakan aplikasi; serta derajat-menit-detik, seperti 6°12\'00.0" S 106°49\'00.0" E, yang biasa ada di peta cetak dan pelayaran.',
        ],
      },
      {
        title: 'Koordinat dipakai untuk apa?',
        bullets: [
          'Mengisi titik lokasi yang tepat di Google Profil Bisnis, direktori usaha, atau aplikasi ojek dan kurir.',
          'Mengirim titik ketemuan atau lokasi proyek tanpa nomor rumah ke pelanggan atau tukang.',
          'Menambahkan lokasi ke foto: salin koordinatnya lalu tempel di alat geotag kami.',
          'Mengecek di mana tepatnya share location yang dikirim lewat WhatsApp.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Kenapa gambar perlu dikompres?',
        bullets: [
          'Gambar biasanya bagian terberat dari halaman web. File yang lebih kecil lebih cepat dimuat dan memperbaiki skor Core Web Vitals.',
          'Banyak layanan email dan formulir online membatasi ukuran lampiran.',
          'Marketplace, toko online, dan Google Profil Bisnis memproses gambar ringan lebih cepat.',
          'Hemat penyimpanan, dan pengunjung Anda juga hemat kuota.',
        ],
      },
      {
        title: 'Cara kerja kompresi PNG',
        paragraphs: [
          'PNG itu lossless, jadi browser hampir tidak bisa mengecilkannya. Kalau Anda tetap memilih PNG, server kami mengubahnya ke palet warna yang dioptimalkan — teknik yang sama dengan kompresor PNG terkenal. Ukurannya biasanya turun 60–80% dengan perbedaan yang hampir tidak terlihat.',
          'File hanya diproses di memori dan tidak disimpan. Kalau ingin tidak ada yang keluar dari perangkat Anda, pilih WebP sebagai format hasil: semuanya terjadi di browser dan hasilnya sering lebih kecil lagi.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'Cara agar iPhone langsung menyimpan foto dalam JPG',
        paragraphs: [
          'Kalau ingin foto langsung berformat JPG, buka Pengaturan › Kamera › Format di iPhone lalu pilih “Paling Kompatibel”. Foto baru akan disimpan sebagai JPG; foto lama tetap HEIC, dan untuk itulah konverter ini.',
          'Catatan: saat berbagi lewat AirDrop atau email, iOS sering otomatis mengubah foto ke JPG. Tapi kalau Anda memindahkannya pakai kabel ke PC Windows atau lewat iCloud untuk Windows, foto tetap HEIC.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Tips gambar untuk website',
        bullets: [
          'Kecilkan dulu, baru konversi: foto 4000 piksel yang ditampilkan 1200 piksel cuma buang kuota. Pakai opsi “Ubah ukuran”.',
          'Kualitas 80–85% adalah keseimbangan yang pas untuk foto di web.',
          'Simpan file aslinya kalau gambar juga akan dipakai untuk cetak atau email.',
          'WordPress, Shopify, dan Wix menerima gambar WebP.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Perlu diketahui',
        paragraphs: [
          `Konversi tidak bisa mengembalikan detail yang sudah hilang dari gambar ${c.F}. Jadi selalu simpan file aslinya dan konversi ulang dari situ kalau perlu.`,
          'Semua konversi berjalan di browser, termasuk di HP. Kalau filenya banyak dan besar, HP lama mungkin agak lambat; konversi saja sedikit demi sedikit.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Konversi paling dicari',
      paragraphs: [
        'Setiap konversi populer punya halaman sendiri lengkap dengan tips: HEIC ke JPG untuk foto iPhone, WebP ke JPG untuk gambar yang diunduh dari internet, JPG ke WebP supaya website lebih cepat, PNG ke JPG untuk file lebih kecil, dan SVG ke PNG untuk logo. Semuanya ada di bawah, di bagian “Alat gratis lainnya”.',
      ],
    },
  ],
};

export default id;
