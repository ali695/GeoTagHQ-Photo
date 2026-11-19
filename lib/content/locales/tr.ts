import type { ToolPageContent } from '../toolPage';

// Natively written for Turkish searchers. Target phrases:
// "fotoğrafa konum ekleme", "fotoğrafa GPS koordinatı ekleme", "fotoğrafa konum bilgisi ekleme",
// "geotag nasıl yapılır", "EXIF düzenleme", "Google İşletme Profili fotoğraf".
const tr: ToolPageContent = {
  metaTitle: 'Fotoğrafa Konum Ekleme: Ücretsiz Online GPS Geotag Aracı',
  metaDescription:
    'Fotoğraflarınıza ücretsiz konum ekleyin: JPG, PNG, WebP ve HEIC dosyalarına GPS koordinatı, başlık ve işletme bilgisi yazın. Üyelik gerekmez.',

  eyebrow: 'Ücretsiz · Üyelik yok · Filigran yok',
  h1: 'Fotoğrafa konum ekleme: GPS koordinatlarını ücretsiz yazın',
  subtitle:
    'Haritada bir nokta seçin, işletme bilgilerinizi girin ve GPS koordinatları EXIF verisine yazılmış fotoğraflarınızı indirin. JPG, PNG, WebP, HEIC ve daha fazlasıyla çalışır; tek seferde 10 fotoğrafa kadar.',
  trustChips: ['%100 ücretsiz', 'Tek seferde 10 fotoğraf', 'Fotoğraflar saklanmaz', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Fotoğraflarıma konum ekle',
  ctaSecondary: 'Nasıl çalışır?',

  stepsTitle: '4 adımda fotoğrafa konum bilgisi nasıl eklenir?',
  stepsIntro: 'Lightroom, ExifTool ya da uygulama indirmenize gerek yok. Her şey bu sayfada yapılır.',
  steps: [
    { title: 'Fotoğrafları yükleyin', desc: 'En fazla 10 görseli sürükleyip bırakın ya da bir web sayfasının adresini yapıştırarak görsellerini içe aktarın. Mevcut EXIF verileri anında görünür.' },
    { title: 'Konumu işaretleyin', desc: 'Adres, işletme adı veya bilinen bir yer arayın, haritadaki işaretçiyi sürükleyin ya da enlem ve boylamı elle girin.' },
    { title: 'İşletme bilgilerini ekleyin', desc: 'Başlık, açıklama, anahtar kelimeler ve işletme adını yazın. Adres, şehir ve posta kodu haritadan otomatik doldurulur.' },
    { title: 'Uygulayın ve indirin', desc: 'Formatı ve sıkıştırmayı seçin, uygula düğmesine tıklayın; fotoğrafları tek tek ya da hepsini ZIP olarak indirin.' },
  ],

  featuresTitle: 'Fotoğraflara geotag eklemek için gereken her şey',
  featuresIntro: 'Görsellerine hızlıca konum bilgisi eklemek isteyen işletme sahipleri, SEO ajansları, emlakçılar ve fotoğrafçılar için tasarlandı.',
  features: [
    { title: 'Haritada adres arama', desc: 'Herhangi bir sokağı, şehri, yeri veya işletmeyi bulun; işaretçiyi sürükleyerek tam noktayı belirleyin.' },
    { title: 'Tam koordinat girişi', desc: 'Konumu zaten biliyorsanız enlem ve boylamı doğrudan yazın.' },
    { title: 'Toplu geotag', desc: 'En fazla 10 fotoğrafa aynı konumu verin ya da tek bir görselin bilgilerini ayrı düzenleyin.' },
    { title: 'Yerel SEO meta verileri', desc: 'Başlık, açıklama, anahtar kelime ve işletme adını Windows’un ve çoğu fotoğraf programının gösterdiği EXIF alanlarına yazın.' },
    { title: 'Dönüştürme ve sıkıştırma', desc: 'JPG, PNG, WebP, AVIF veya TIFF olarak dışa aktarın, siteniz daha hızlı açılsın diye dosya boyutunu küçültün.' },
    { title: 'URL’den içe aktarma', desc: 'Görselleri önce indirmeden, herkese açık bir sayfadan ya da doğrudan görsel bağlantısından alın.' },
    { title: 'Kırpma ve düzenleme', desc: 'Konum eklemeden önce görseli sabit bir oranda ya da serbestçe kırpın.' },
  ],

  metadataTitle: 'Araç fotoğrafınıza hangi EXIF verilerini yazar?',
  metadataIntro: 'Geotag, konumun doğrudan görsel dosyasının içine, yani EXIF meta verisine kaydedilmesidir. PinPixl’nun yazdığı alanlar şunlardır:',
  metadataHeaders: ['Bilgi', 'EXIF alanı', 'Örnek'],
  metadataRows: [
    { field: 'GPS konumu', example: '40.9909° K, 29.0303° D' },
    { field: 'Başlık', example: 'Kadıköy’deki fırınımızdan sıcak simit' },
    { field: 'Açıklama', example: 'Moda’daki dükkanımızda sabah fırını.' },
    { field: 'Anahtar kelimeler', example: 'fırın, simit, Kadıköy' },
    { field: 'İşletme adı', example: 'İşletmenizin adı' },
    { field: 'Şehir, ülke ve diğerleri', example: 'City: İstanbul; Country: Türkiye' },
    { field: 'Çekim tarihi, kamera', example: '2026:11:18 07:30:00' },
  ],
  metadataNote: 'En güvenilir sonuç JPG ile alınır. Diğer formatlar dönüştürülür; bazı alanların okunması görseli yüklediğiniz platforma bağlıdır.',

  useCasesTitle: 'Fotoğrafa konum eklemek kimin işine yarar?',
  useCases: [
    { title: 'Google İşletme Profili olan işletmeler', desc: 'Dükkân, ekip ve iş fotoğraflarınızı yüklemeden önce tutarlı konum bilgileriyle hazırlayın.' },
    { title: 'SEO ve dijital pazarlama ajansları', desc: 'Müşteri fotoğraflarına her şube için doğru ad, anahtar kelime ve adresi toplu olarak ekleyin.' },
    { title: 'Emlakçılar', desc: 'Her ilan fotoğrafının nerede çekildiğini kaydedin, ilanlarınız ve arşiviniz düzenli kalsın.' },
    { title: 'Ustalar ve hizmet firmaları', desc: 'İşi nerede yaptığınızı gösterin: önce-sonra fotoğrafları iş yerinin konumunu taşır.' },
    { title: 'Fotoğrafçılar ve gezginler', desc: 'GPS’i olmayan kameralarla çekilen fotoğraflara konum ekleyin; Google Fotoğraflar, Apple Fotoğraflar veya Lightroom haritasında görünsün.' },
    { title: 'Web sitesi sahipleri', desc: 'Faydalı meta verileri kaybetmeden görselleri sıkıştırıp dönüştürün, sayfalarınız hızlansın.' },
  ],

  seoTitle: 'Fotoğrafa konum eklemek yerel SEO’ya yardımcı olur mu? Dürüst cevap',
  seoParagraphs: [
    'Geotag çoğu zaman sıralama hilesi gibi pazarlanır. Öyle değildir. Google, görsellerdeki GPS verisinin bir sıralama faktörü olduğunu hiçbir zaman doğrulamadı; ayrıca Google İşletme Profili’ne yüklenen fotoğrafların EXIF verileri yayınlanırken silinir.',
    'Peki neden konum eklenir? Çünkü konum bilgisi fotoğraf arşivinizi düzenli tutar, fotoğraf uygulamalarının ve haritaların görselleri doğru yere koymasını sağlar ve kendi sitenizde ya da rehberlerde yayınladığınız dosyalara tutarlı bir konum bilgisi daha ekler. Bunu yerel SEO’yu destekleyen iyi bir alışkanlık olarak görün, onun yerine geçen bir şey olarak değil.',
    'Yerel aramada gerçekten işe yarayan, insanların ve Google’ın gördüğü şeylerdir: işletmenizin gerçek fotoğrafları, açıklayıcı dosya adları, faydalı alternatif metinler ve her yerde aynı olan işletme adı, adres ve telefon.',
  ],
  seoChecklistTitle: 'Görseller için yerel SEO kontrol listesi',
  seoChecklist: [
    'Stok görsel yerine dükkânınızın, ekibinizin ve işlerinizin gerçek fotoğraflarını kullanın.',
    'Dosyalara açıklayıcı ad verin: IMG_4521.jpg yerine kadikoy-firin-simit.jpg gibi.',
    'Alternatif metinde görselde ne olduğunu anlatın, anahtar kelime sıralamayın.',
    'Sayfanın telefonda hızlı açılması için görselleri sıkıştırın.',
    'Google İşletme Profili’nize düzenli olarak yeni fotoğraf ekleyin.',
    'İşletme adı, adres ve telefonu sitenizde ve tüm kayıtlarda birebir aynı tutun.',
  ],

  privacyTitle: 'Fotoğraflarınızla ne yapıyoruz?',
  privacyParagraphs: [
    'Meta verileri yazmak ve formatı dönüştürmek için fotoğrafınız şifreli bir bağlantıyla sunucumuza gönderilir, bellekte işlenir ve size indirme olarak geri verilir. Fotoğraflarınızı kaydetmeyiz, kopyasını tutmayız ve başka hiçbir amaçla kullanmayız.',
    'Üyelik olmadığı için fotoğraflarınızı size bağlayan hiçbir şey yoktur. Konum araması herkese açık harita verilerini kullanır.',
  ],

  formatsTitle: 'Desteklenen görsel formatları',
  formats: [
    { format: 'JPG / JPEG', support: 'Tam', note: 'En iyi seçim. GPS ve tüm metin alanları her yerde desteklenir.' },
    { format: 'PNG', support: 'İyi', note: 'GPS yazılır ama bazı siteler ve uygulamalar PNG meta verilerini yok sayar.' },
    { format: 'WebP', support: 'İyi', note: 'Web için hafif dosyalar. Meta veri desteği platforma göre değişir.' },
    { format: 'HEIC / HEIF', support: 'Dönüştürülür', note: 'iPhone fotoğrafları. En geniş uyumluluk için JPG olarak dışa aktarın.' },
    { format: 'AVIF, TIFF', support: 'Dönüştürülür', note: 'Kabul edilir ve dışa aktarılır. Platformunuzun meta verileri okuyup okumadığını kontrol edin.' },
  ],

  faqTitle: 'Fotoğrafa konum ekleme hakkında sık sorulan sorular',
  faqSubtitle: 'GPS, EXIF ve görsel meta verileri hakkında en çok sorulanlar.',
  faqs: [
    { q: 'Fotoğrafa konum nasıl eklenir?', a: 'Fotoğrafı yukarıya yükleyin, adresi arayın ya da haritadaki işaretçiyi sürükleyin ve uygula’ya tıklayın. Araç koordinatları EXIF verisine yazar, siz de konumlu fotoğrafı indirirsiniz. Bir dakikadan kısa sürer, kurulum gerekmez.' },
    { q: 'Bu araç gerçekten ücretsiz mi?', a: 'Evet. Üyelik, filigran ya da ücretli paket yok. Tek seferde, her biri en fazla 10 MB olan 10 fotoğrafa kadar işlem yapabilirsiniz.' },
    { q: 'Fotoğrafa konum eklemek Google sıralamamı yükseltir mi?', a: 'Doğrudan değil. Google, görsellerdeki GPS verisini sıralama faktörü olarak doğrulamadı ve Google İşletme Profili yayınlanan fotoğraflardan EXIF verilerini siler. Görselleri düzenlemek ve bilgileri tutarlı tutmak için faydalıdır; ama gerçek fotoğraflar, iyi dosya adları ve alternatif metin daha önemlidir.' },
    { q: 'Google İşletme Profili’ne yüklemeden önce fotoğraflara konum eklemeli miyim?', a: 'Zararı yoktur ve orijinal dosyalarınızı düzenli tutar, ancak tek başına sıralama artışı beklemeyin. Asıl önemli olan düzenli olarak gerçek, güncel ve kaliteli fotoğraflar yüklemektir.' },
    { q: 'Fotoğrafın EXIF verileri online nasıl düzenlenir?', a: 'PinPixl ile GPS konumu, başlık, açıklama, anahtar kelime, işletme adı, tarih ve kamera bilgisini formdan değiştirip yeni EXIF verileriyle dosyayı indirebilirsiniz; program kurmanız gerekmez.' },
    { q: 'Fotoğraflarımı saklıyor musunuz?', a: 'Hayır. Fotoğraflar yalnızca meta verileri yazmak ve formatı dönüştürmek için sunucumuzun belleğinde işlenir, ardından size geri verilir. Kaydedilmez ve paylaşılmaz.' },
    { q: 'Bir fotoğrafta konum bilgisi olup olmadığını nasıl anlarım?', a: 'Fotoğrafı araca yükleyin, meta veriler anında görünür. Windows’ta dosyaya sağ tıklayıp Özellikler › Ayrıntılar’a bakın. Mac’te Önizleme ile açıp Araçlar › Denetçiyi Göster’i seçin.' },
    { q: 'iPhone’un HEIC fotoğraflarına konum ekleyebilir miyim?', a: 'Evet, HEIC ve HEIF dosyaları desteklenir. En iyi uyumluluk için JPG olarak dışa aktarın.' },
    { q: 'Birden fazla fotoğrafa aynı anda konum ekleyebilir miyim?', a: 'Evet. 10 fotoğrafa kadar yükleyin, bir konum seçip hepsine uygulayın ve tümünü ZIP olarak indirin. Her fotoğrafı yine ayrı ayrı düzenleyebilirsiniz.' },
    { q: 'Konum eklemek fotoğraf kalitesini düşürür mü?', a: 'Hayır, sıkıştırma veya farklı bir format seçmediğiniz sürece. Sıkıştırma Yok ve orijinal format seçiliyken yalnızca meta veriler değişir.' },
  ],

  finalCtaTitle: 'Fotoğraflarınıza konum eklemeye hazır mısınız?',
  finalCtaText: 'Ücretsiz, üyeliksiz ve bir dakikadan kısa sürede.',
  finalCtaButton: 'Hemen başla',
};

export default tr;
