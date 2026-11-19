import type { ToolExtras } from '../types';

// Turkish long-form sections, written natively.
const tr: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'EXIF verisi nedir?',
        paragraphs: [
          'EXIF, “Exchangeable Image File Format” ifadesinin kısaltmasıdır. Her fotoğraf çektiğinizde fotoğraf makineniz ya da telefonunuz dosyanın içine görünmeyen bilgiler yazar: cihaz modeli, lens, diyafram, enstantane, ISO, tarih ve saat… Konum servisleri açıksa tam GPS koordinatları da buna eklenir.',
          'Lightroom, Photoshop gibi programlar da genellikle XMP ve IPTC verisi bırakır: başlık, açıklama, anahtar kelimeler, fotoğrafçı ve telif bilgisi. Görüntüleyici bunların hepsini tek ekranda gösterir; Windows’ta “Özellikler” penceresinde gördüğünüz birkaç alandan çok daha fazlasını.',
        ],
      },
      {
        title: 'Bazı fotoğraflarda neden hiç meta veri yok?',
        paragraphs: [
          'WhatsApp, Facebook, Instagram veya X’e yüklediğiniz fotoğrafların meta verisi neredeyse her zaman silinir; hem gizlilik hem de yer tasarrufu için. Bu yüzden bir sohbetten kaydettiğiniz görselde çoğu zaman ne cihaz bilgisi ne de konum kalır.',
          'Ekran görüntüleri, taranmış belgeler ve düzenlenmiş görsellerin çoğunda da EXIF yok denecek kadar azdır. Bir fotoğrafın gerçekte ne sakladığını görmek istiyorsanız telefondan veya makineden çıkan orijinal dosyayı kullanın.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Fotoğraftaki konum ne kadar doğru?',
        paragraphs: [
          'Araç, telefonun fotoğrafı çekerken kaydettiği GPS koordinatlarını okur; görüntüde ne olduğuna bakıp tahmin yürütmez. Açık havada kaydedilen nokta genellikle gerçek yerden 5–20 metre uzaktadır.',
          'Kapalı alanlarda, yüksek binalar arasındaki dar sokaklarda ya da telefon yeni açıldığında GPS sinyali zayıf olduğu veya yansıdığı için sapma artabilir. Uydu görünümüyle noktanın mantıklı olup olmadığını hemen kontrol edebilirsiniz.',
        ],
      },
      {
        title: 'Kendi konumunuzu koruyun',
        paragraphs: [
          'Başkasının fotoğrafının nerede çekildiğini bulmayı sağlayan şey sizin için de geçerli: orijinal fotoğrafınızı e-posta, bulut bağlantısı ya da AirDrop ile alan biri evinizin veya çocuğunuzun okulunun yerini tam olarak görebilir.',
          'sahibinden, Letgo ya da Dolap’a ilan vermeden veya evinizin fotoğraflarını paylaşmadan önce konumu “EXIF verisi silme” aracımızla kaldırın. Birkaç saniye sürer.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Kayıpsız: görüntü olduğu gibi kalır',
        paragraphs: [
          'Birçok çevrimiçi araç görüntünün tamamını yeniden kaydeder ve her seferinde biraz kalite kaybolur. JPG, PNG ve WebP dosyalarında biz yalnızca meta veri bloklarını dosyadan çıkarırız; görüntü verisi bayt bayt aynı kalır.',
          'İki istisna var: Ancak yön etiketi sayesinde düz görünen fotoğraflar düzeltilmiş hâliyle kaydedilir (yoksa yan yatmış görünürlerdi). iPhone’un HEIC fotoğrafları ise JPG olarak kaydedilir, çünkü tarayıcılar HEIC dosyası oluşturamaz.',
        ],
      },
      {
        title: 'Neler silinir?',
        bullets: [
          'EXIF: GPS konumu, kamera modeli, lens, çekim ayarları, tarihler, yazılım, seri numaraları ve küçük önizleme.',
          'XMP: Lightroom gibi programlardan gelen düzenleme geçmişi, puanlar, anahtar kelimeler ve konum bilgisi.',
          'IPTC: açıklama, fotoğrafçı, telif ve iletişim bilgileri.',
          'PNG dosyalarındaki yorumlar ve metin blokları.',
          'Renk profili (ICC) korunur; böylece renkler değişmez.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Enlem ve boylam, kısaca',
        paragraphs: [
          'Enlem, bir yerin ekvatorun ne kadar kuzeyinde ya da güneyinde olduğunu gösterir (−90° ile +90° arası). Boylam ise Greenwich başlangıç meridyeninin ne kadar doğusunda ya da batısında olduğunu gösterir (−180° ile +180° arası). İkisi birlikte bir noktanın coğrafi koordinatlarını oluşturur.',
          'İki yazım şekli yaygındır: Google Haritalar ve çoğu uygulamanın kullandığı ondalık derece, örneğin 41.008238, 28.978359; ya da harita ve denizcilikte görülen derece-dakika-saniye, örneğin 41°00\'29.7" N 28°58\'42.1" E.',
        ],
      },
      {
        title: 'Koordinatlar ne işe yarar?',
        bullets: [
          'Google İşletme Profili’ne, firma rehberlerine veya kurye uygulamalarına tam konumu girmek.',
          'Müşteriye ya da ustaya kapı numarası olmayan bir buluşma noktası veya şantiye göndermek.',
          'Fotoğraflara konum eklemek: koordinatları kopyalayıp geotag aracımıza yapıştırın.',
          'WhatsApp’tan gelen bir konumun tam olarak nerede olduğunu kontrol etmek.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Görselleri neden sıkıştırmalı?',
        bullets: [
          'Bir web sayfasının en ağır kısmı genellikle görsellerdir. Küçük dosyalar daha hızlı açılır ve Core Web Vitals puanlarını iyileştirir.',
          'Birçok e-posta servisi ve form dosya boyutunu sınırlar.',
          'E-ticaret siteleri, ilan siteleri ve Google İşletme Profili hafif görselleri daha hızlı işler.',
          'Depolama alanından tasarruf edersiniz, ziyaretçileriniz de daha az mobil veri harcar.',
        ],
      },
      {
        title: 'PNG sıkıştırma nasıl çalışır?',
        paragraphs: [
          'PNG kayıpsız bir formattır; tarayıcı onu neredeyse hiç küçültemez. PNG olarak kalmasını seçerseniz sunucumuz dosyayı optimize edilmiş bir renk paletine indirir; bilinen PNG sıkıştırıcılarla aynı teknik. Boyut genellikle %60–80 azalır, fark gözle zor seçilir.',
          'Dosya yalnızca bellekte işlenir ve saklanmaz. Hiçbir şeyin cihazınızdan çıkmasını istemiyorsanız çıktı olarak WebP seçin: her şey tarayıcıda olur ve dosya çoğu zaman daha da küçük olur.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'iPhone’da fotoğrafları doğrudan JPG kaydetmek',
        paragraphs: [
          'Fotoğraflarınızın baştan JPG olmasını istiyorsanız iPhone’da Ayarlar › Kamera › Formatlar yolunu izleyip “En Uyumlu” seçeneğini işaretleyin. Yeni fotoğraflar JPG olarak kaydedilir; mevcut fotoğraflar HEIC kalır ve bu dönüştürücü tam olarak onlar için.',
          'Bilgi: AirDrop veya e-postayla paylaşırken iOS fotoğrafları çoğu zaman kendiliğinden JPG’ye çevirir. Kabloyla Windows bilgisayara ya da iCloud for Windows ile aktardığınızda ise HEIC olarak kalırlar.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Siteniz için görsel ipuçları',
        bullets: [
          'Önce boyutlandırın, sonra dönüştürün: 1200 pikselde gösterilen 4000 piksellik bir fotoğraf boşuna veri harcatır. “Yeniden boyutlandır” seçeneğini kullanın.',
          'Web’deki fotoğraflar için %80–85 kalite iyi bir dengedir.',
          'Görseli baskı veya e-posta için de kullanacaksanız orijinali saklayın.',
          'WordPress, Shopify, ikas ve Ticimax WebP görselleri destekler.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Bilmekte fayda var',
        paragraphs: [
          `Dönüştürme, ${c.F} görselinde artık bulunmayan ayrıntıları geri getiremez. Bu yüzden orijinal dosyayı her zaman saklayın ve gerektiğinde yeniden ondan dönüştürün.`,
          'Tüm dönüştürmeler tarayıcınızda yapılır, telefonda da. Çok sayıda büyük dosyada eski cihazlar biraz yavaşlayabilir; bu durumda dosyaları küçük gruplar hâlinde dönüştürün.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'En çok aranan dönüştürmeler',
      paragraphs: [
        'Popüler her dönüştürmenin ipuçlarıyla dolu kendi sayfası var: iPhone fotoğrafları için HEIC’ten JPG’ye, internetten indirilen görseller için WebP’den JPG’ye, daha hızlı bir site için JPG’den WebP’ye, daha küçük dosyalar için PNG’den JPG’ye ve logolar için SVG’den PNG’ye. Hepsini aşağıda “Diğer ücretsiz araçlar” bölümünde bulabilirsiniz.',
      ],
    },
  ],
};

export default tr;
