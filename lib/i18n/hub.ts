// Native content for the language home pages (/de, /es, ...).
// Written per market around the phrases people actually search, with an answer-first
// definition for AI search, three reasons, four FAQs and a closing call to action.
export type HubContent = {
  answer: string;
  whyTitle: string;
  why: { t: string; d: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

export const HUB: Record<string, HubContent> = {
  de: {
    answer: 'PinPixl ist eine Sammlung kostenloser Foto-Tools im Browser: Sie können Fotos geotaggen, EXIF-Daten anzeigen und entfernen, den Aufnahmeort finden, HEIC in JPG umwandeln und Bilder komprimieren – ohne Anmeldung und ohne Wasserzeichen.',
    whyTitle: 'Warum PinPixl?',
    why: [
      { t: 'Ihre Fotos bleiben bei Ihnen', d: 'Die meisten Tools arbeiten direkt in Ihrem Browser. Wo der Server nötig ist, wird nichts gespeichert.' },
      { t: 'Geprüfte Ergebnisse', d: 'Jede Datei wird vor dem Download kontrolliert: GPS wirklich geschrieben, Metadaten wirklich entfernt.' },
      { t: 'iPhone-Fotos inklusive', d: 'HEIC-Bilder vom iPhone funktionieren in jedem Tool, auch am Windows-PC.' },
    ],
    faqTitle: 'Häufige Fragen',
    faqs: [
      { q: 'Sind die Foto-Tools wirklich kostenlos?', a: 'Ja. Alle Tools sind kostenlos, ohne Konto, ohne Abo und ohne Wasserzeichen.' },
      { q: 'Wie kann ich EXIF-Daten aus einem Foto entfernen?', a: 'Öffnen Sie „EXIF-Daten entfernen“, laden Sie das Foto hoch und laden Sie die bereinigte Datei herunter. Standort, Kameradaten und Datum werden verlustfrei gelöscht.' },
      { q: 'Wie wandle ich HEIC in JPG um?', a: 'Mit dem Tool „HEIC in JPG“: Bilder hineinziehen, Qualität wählen, herunterladen. Die Umwandlung läuft komplett in Ihrem Browser.' },
      { q: 'Werden meine Fotos hochgeladen?', a: 'Bei den meisten Tools nicht. Nur das Geotagging und die PNG-Komprimierung nutzen unseren Server, der die Datei im Arbeitsspeicher verarbeitet und sofort löscht.' },
    ],
    ctaTitle: 'Fotos jetzt geotaggen',
    ctaText: 'GPS-Standort und Firmendaten in Sekunden ins Foto schreiben – kostenlos.',
    ctaButton: 'Zum Geotagging-Tool',
  },
  es: {
    answer: 'PinPixl es un conjunto de herramientas gratis para fotos que funcionan en tu navegador: geoetiquetar fotos, ver y quitar datos EXIF, saber dónde se tomó una foto, convertir HEIC a JPG y comprimir imágenes, sin registro y sin marca de agua.',
    whyTitle: '¿Por qué PinPixl?',
    why: [
      { t: 'Tus fotos no salen de tu equipo', d: 'Casi todas las herramientas trabajan en tu navegador. Cuando hace falta el servidor, no se guarda nada.' },
      { t: 'Resultados comprobados', d: 'Revisamos cada archivo antes de que lo descargues: GPS escrito de verdad, metadatos borrados de verdad.' },
      { t: 'Fotos de iPhone incluidas', d: 'Las imágenes HEIC del iPhone funcionan en todas las herramientas, también en Windows.' },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { q: '¿Las herramientas son gratis de verdad?', a: 'Sí. Todas son gratis, sin cuenta, sin suscripción y sin marca de agua.' },
      { q: '¿Cómo quito los datos EXIF de una foto?', a: 'Abre “Quitar datos EXIF”, sube la foto y descarga el archivo limpio. Se borran la ubicación, los datos de la cámara y la fecha sin perder calidad.' },
      { q: '¿Cómo convierto HEIC a JPG?', a: 'Con la herramienta “HEIC a JPG”: arrastra las fotos, elige la calidad y descárgalas. Todo ocurre en tu navegador.' },
      { q: '¿Se suben mis fotos a algún servidor?', a: 'En la mayoría de las herramientas, no. Solo el geoetiquetado y la compresión de PNG usan nuestro servidor, que procesa el archivo en memoria y lo borra al momento.' },
    ],
    ctaTitle: 'Geoetiqueta tus fotos ahora',
    ctaText: 'Añade ubicación GPS y datos de tu negocio a tus fotos en segundos, gratis.',
    ctaButton: 'Abrir el geoetiquetador',
  },
  fr: {
    answer: 'PinPixl réunit des outils photo gratuits qui fonctionnent dans votre navigateur : géolocaliser une photo, lire et supprimer les données EXIF, retrouver le lieu d’une photo, convertir HEIC en JPG et compresser vos images, sans inscription ni filigrane.',
    whyTitle: 'Pourquoi PinPixl ?',
    why: [
      { t: 'Vos photos restent chez vous', d: 'La plupart des outils fonctionnent dans votre navigateur. Quand le serveur est nécessaire, rien n’est conservé.' },
      { t: 'Des résultats vérifiés', d: 'Chaque fichier est contrôlé avant le téléchargement : GPS bien écrit, métadonnées bien supprimées.' },
      { t: 'Photos d’iPhone comprises', d: 'Les images HEIC de l’iPhone passent dans tous les outils, y compris sur Windows.' },
    ],
    faqTitle: 'Questions fréquentes',
    faqs: [
      { q: 'Les outils sont-ils vraiment gratuits ?', a: 'Oui. Tous les outils sont gratuits, sans compte, sans abonnement et sans filigrane.' },
      { q: 'Comment supprimer les données EXIF d’une photo ?', a: 'Ouvrez « Supprimer les données EXIF », ajoutez la photo et téléchargez le fichier nettoyé. Lieu, infos de l’appareil et date sont effacés sans perte de qualité.' },
      { q: 'Comment convertir HEIC en JPG ?', a: 'Avec l’outil « HEIC en JPG » : glissez vos photos, choisissez la qualité, téléchargez. La conversion se fait entièrement dans votre navigateur.' },
      { q: 'Mes photos sont-elles envoyées sur un serveur ?', a: 'Pas pour la plupart des outils. Seuls la géolocalisation et la compression PNG passent par notre serveur, qui traite le fichier en mémoire puis le supprime aussitôt.' },
    ],
    ctaTitle: 'Géolocalisez vos photos maintenant',
    ctaText: 'Ajoutez une position GPS et les infos de votre entreprise à vos photos en quelques secondes, gratuitement.',
    ctaButton: 'Ouvrir l’outil de géolocalisation',
  },
  pt: {
    answer: 'PinPixl é um conjunto de ferramentas de foto grátis que funcionam no seu navegador: colocar localização na foto, ver e remover dados EXIF, descobrir onde a foto foi tirada, converter HEIC para JPG e comprimir imagens, sem cadastro e sem marca d’água.',
    whyTitle: 'Por que usar o PinPixl?',
    why: [
      { t: 'Suas fotos ficam com você', d: 'Quase todas as ferramentas rodam no seu navegador. Quando o servidor é necessário, nada fica guardado.' },
      { t: 'Resultado conferido', d: 'Cada arquivo é verificado antes do download: GPS gravado de verdade, metadados apagados de verdade.' },
      { t: 'Fotos do iPhone incluídas', d: 'Imagens HEIC do iPhone funcionam em todas as ferramentas, inclusive no Windows.' },
    ],
    faqTitle: 'Perguntas frequentes',
    faqs: [
      { q: 'As ferramentas são grátis mesmo?', a: 'Sim. Todas são grátis, sem conta, sem assinatura e sem marca d’água.' },
      { q: 'Como remover os dados EXIF de uma foto?', a: 'Abra “Remover dados EXIF”, envie a foto e baixe o arquivo limpo. Localização, dados da câmera e data são apagados sem perder qualidade.' },
      { q: 'Como converter HEIC para JPG?', a: 'Use a ferramenta “HEIC para JPG”: arraste as fotos, escolha a qualidade e baixe. Tudo acontece no seu navegador.' },
      { q: 'Minhas fotos são enviadas para um servidor?', a: 'Na maioria das ferramentas, não. Só a geolocalização e a compressão de PNG usam nosso servidor, que processa o arquivo na memória e apaga na hora.' },
    ],
    ctaTitle: 'Coloque localização nas suas fotos agora',
    ctaText: 'Adicione GPS e os dados do seu negócio às fotos em segundos, de graça.',
    ctaButton: 'Abrir a ferramenta de geotag',
  },
  it: {
    answer: 'PinPixl è una raccolta di strumenti foto gratis che funzionano nel browser: geotaggare foto, vedere e rimuovere i dati EXIF, scoprire dove è stata scattata una foto, convertire HEIC in JPG e comprimere immagini, senza registrazione e senza filigrana.',
    whyTitle: 'Perché PinPixl?',
    why: [
      { t: 'Le tue foto restano tue', d: 'Quasi tutti gli strumenti lavorano nel tuo browser. Quando serve il server, non viene salvato nulla.' },
      { t: 'Risultati verificati', d: 'Controlliamo ogni file prima del download: GPS scritto davvero, metadati cancellati davvero.' },
      { t: 'Anche le foto dell’iPhone', d: 'Le immagini HEIC dell’iPhone funzionano in tutti gli strumenti, anche su Windows.' },
    ],
    faqTitle: 'Domande frequenti',
    faqs: [
      { q: 'Gli strumenti sono davvero gratis?', a: 'Sì. Sono tutti gratis, senza account, senza abbonamento e senza filigrana.' },
      { q: 'Come rimuovo i dati EXIF da una foto?', a: 'Apri “Rimuovere dati EXIF”, carica la foto e scarica il file pulito. Posizione, dati della fotocamera e data vengono cancellati senza perdita di qualità.' },
      { q: 'Come converto HEIC in JPG?', a: 'Con lo strumento “HEIC in JPG”: trascina le foto, scegli la qualità e scarica. Tutto avviene nel tuo browser.' },
      { q: 'Le mie foto vengono caricate su un server?', a: 'Per la maggior parte degli strumenti no. Solo il geotag e la compressione PNG usano il nostro server, che elabora il file in memoria e lo cancella subito.' },
    ],
    ctaTitle: 'Geotagga le tue foto adesso',
    ctaText: 'Aggiungi posizione GPS e dati della tua attività alle foto in pochi secondi, gratis.',
    ctaButton: 'Apri lo strumento di geotag',
  },
  nl: {
    answer: 'PinPixl is een set gratis fototools die in je browser werken: foto’s geotaggen, EXIF-gegevens bekijken en verwijderen, zien waar een foto is gemaakt, HEIC naar JPG omzetten en afbeeldingen verkleinen, zonder account en zonder watermerk.',
    whyTitle: 'Waarom PinPixl?',
    why: [
      { t: 'Je foto’s blijven van jou', d: 'Bijna alle tools werken in je browser. Is de server nodig, dan wordt er niets bewaard.' },
      { t: 'Gecontroleerde resultaten', d: 'Elk bestand wordt gecheckt voor je het downloadt: GPS echt geschreven, metadata echt verwijderd.' },
      { t: 'Ook iPhone-foto’s', d: 'HEIC-foto’s van je iPhone werken in elke tool, ook op Windows.' },
    ],
    faqTitle: 'Veelgestelde vragen',
    faqs: [
      { q: 'Zijn de tools echt gratis?', a: 'Ja. Alle tools zijn gratis, zonder account, zonder abonnement en zonder watermerk.' },
      { q: 'Hoe verwijder ik EXIF-gegevens uit een foto?', a: 'Open ‘EXIF-gegevens verwijderen’, kies je foto en download het opgeschoonde bestand. Locatie, cameragegevens en datum gaan eruit zonder kwaliteitsverlies.' },
      { q: 'Hoe zet ik HEIC om naar JPG?', a: 'Met de tool ‘HEIC naar JPG’: sleep je foto’s erin, kies de kwaliteit en download. Alles gebeurt in je browser.' },
      { q: 'Worden mijn foto’s geüpload?', a: 'Bij de meeste tools niet. Alleen geotaggen en PNG-compressie gaan via onze server, die het bestand in het geheugen verwerkt en meteen wist.' },
    ],
    ctaTitle: 'Geotag je foto’s nu',
    ctaText: 'Zet GPS-locatie en bedrijfsgegevens in een paar seconden in je foto’s, gratis.',
    ctaButton: 'Naar de geotag-tool',
  },
  tr: {
    answer: 'PinPixl, tarayıcınızda çalışan ücretsiz fotoğraf araçlarından oluşur: fotoğrafa konum ekleme, EXIF verilerini görme ve silme, fotoğrafın çekildiği yeri bulma, HEIC’i JPG’ye çevirme ve resim küçültme. Üyelik ve filigran yok.',
    whyTitle: 'Neden PinPixl?',
    why: [
      { t: 'Fotoğraflarınız sizde kalır', d: 'Araçların çoğu doğrudan tarayıcınızda çalışır. Sunucu gerektiğinde hiçbir şey saklanmaz.' },
      { t: 'Kontrol edilmiş sonuç', d: 'Her dosya indirmeden önce kontrol edilir: GPS gerçekten yazılmış, meta veri gerçekten silinmiş olur.' },
      { t: 'iPhone fotoğrafları da dahil', d: 'iPhone’un HEIC görselleri tüm araçlarda, Windows’ta bile çalışır.' },
    ],
    faqTitle: 'Sık sorulan sorular',
    faqs: [
      { q: 'Araçlar gerçekten ücretsiz mi?', a: 'Evet. Tüm araçlar ücretsizdir; hesap, abonelik veya filigran yoktur.' },
      { q: 'Fotoğraftaki EXIF verilerini nasıl silerim?', a: '“EXIF verilerini silme” aracını açın, fotoğrafı seçin ve temizlenmiş dosyayı indirin. Konum, kamera bilgileri ve tarih kalite kaybı olmadan silinir.' },
      { q: 'HEIC dosyasını JPG’ye nasıl çeviririm?', a: '“HEIC → JPG” aracıyla: fotoğrafları sürükleyin, kaliteyi seçin ve indirin. Dönüştürme tamamen tarayıcınızda yapılır.' },
      { q: 'Fotoğraflarım sunucuya yükleniyor mu?', a: 'Araçların çoğunda hayır. Yalnızca konum ekleme ve PNG sıkıştırma sunucumuzu kullanır; dosya bellekte işlenir ve hemen silinir.' },
    ],
    ctaTitle: 'Fotoğraflarınıza şimdi konum ekleyin',
    ctaText: 'GPS konumunu ve işletme bilgilerinizi saniyeler içinde fotoğrafa yazın, ücretsiz.',
    ctaButton: 'Konum ekleme aracını aç',
  },
  id: {
    answer: 'PinPixl adalah kumpulan alat foto gratis yang berjalan di browser: menambah lokasi di foto, melihat dan menghapus data EXIF, mencari tahu di mana foto diambil, mengubah HEIC ke JPG, dan mengompres foto, tanpa daftar dan tanpa watermark.',
    whyTitle: 'Kenapa PinPixl?',
    why: [
      { t: 'Foto Anda tetap milikmu', d: 'Hampir semua alat berjalan di browser Anda. Kalau server diperlukan, tidak ada yang disimpan.' },
      { t: 'Hasil sudah dicek', d: 'Setiap file diperiksa sebelum Anda unduh: GPS benar-benar tertulis, metadata benar-benar terhapus.' },
      { t: 'Foto iPhone juga bisa', d: 'Foto HEIC dari iPhone bisa dipakai di semua alat, termasuk di Windows.' },
    ],
    faqTitle: 'Pertanyaan yang sering diajukan',
    faqs: [
      { q: 'Apakah alatnya benar-benar gratis?', a: 'Ya. Semua alat gratis, tanpa akun, tanpa langganan, dan tanpa watermark.' },
      { q: 'Bagaimana cara menghapus data EXIF dari foto?', a: 'Buka “Hapus data EXIF”, pilih fotonya, lalu unduh file yang sudah bersih. Lokasi, info kamera, dan tanggal terhapus tanpa mengurangi kualitas.' },
      { q: 'Bagaimana cara mengubah HEIC ke JPG?', a: 'Pakai alat “HEIC ke JPG”: seret fotonya, pilih kualitas, lalu unduh. Semua proses terjadi di browser Anda.' },
      { q: 'Apakah fotoku diunggah ke server?', a: 'Untuk sebagian besar alat, tidak. Hanya geotag dan kompresi PNG yang memakai server kami; file diproses di memori lalu langsung dihapus.' },
    ],
    ctaTitle: 'Tambahkan lokasi ke foto Anda sekarang',
    ctaText: 'Masukkan lokasi GPS dan info usaha Anda ke foto dalam hitungan detik, gratis.',
    ctaButton: 'Buka alat geotag',
  },
  ja: {
    answer: 'PinPixlは、ブラウザで使える無料の画像ツール集です。写真への位置情報の追加、Exif情報の確認・削除、撮影場所の特定、HEICからJPGへの変換、画像の圧縮が、登録不要・透かしなしで行えます。',
    whyTitle: 'PinPixlが選ばれる理由',
    why: [
      { t: '写真は手元から出ません', d: 'ほとんどのツールはブラウザ内で処理します。サーバーを使う場合も、データは保存しません。' },
      { t: '結果を確認してからお渡し', d: 'ダウンロード前に毎回チェック。位置情報が本当に書き込まれたか、Exifが本当に消えたかを確かめます。' },
      { t: 'iPhoneの写真もそのまま', d: 'iPhoneのHEIC画像は、Windowsでもすべてのツールで使えます。' },
    ],
    faqTitle: 'よくある質問',
    faqs: [
      { q: '本当に無料で使えますか？', a: 'はい。すべてのツールが無料で、会員登録・有料プラン・透かしはありません。' },
      { q: '写真のExif情報はどうやって削除しますか？', a: '「EXIF情報を削除」を開いて写真を選び、きれいになったファイルをダウンロードするだけです。位置情報・カメラ情報・日時を画質そのままで削除します。' },
      { q: 'HEICをJPGに変換するには？', a: '「HEICをJPGに変換」ツールに写真をドラッグし、画質を選んでダウンロードします。変換はすべてブラウザ内で行われます。' },
      { q: '写真はサーバーにアップロードされますか？', a: 'ほとんどのツールではアップロードされません。位置情報の書き込みとPNG圧縮のみサーバーを使い、メモリ上で処理してすぐに削除します。' },
    ],
    ctaTitle: '今すぐ写真に位置情報を追加',
    ctaText: 'GPS座標とお店の情報を、数秒で写真に書き込めます。無料です。',
    ctaButton: 'ジオタグツールを開く',
  },
  ko: {
    answer: 'PinPixl은 브라우저에서 바로 쓰는 무료 사진 도구 모음입니다. 사진에 위치 정보 추가, EXIF 확인·삭제, 촬영 장소 찾기, HEIC를 JPG로 변환, 이미지 용량 줄이기를 회원가입이나 워터마크 없이 할 수 있습니다.',
    whyTitle: 'PinPixl을 쓰는 이유',
    why: [
      { t: '사진은 내 기기에', d: '대부분의 도구가 브라우저 안에서 처리합니다. 서버가 필요할 때도 아무것도 저장하지 않습니다.' },
      { t: '확인된 결과만', d: '다운로드 전에 모든 파일을 확인합니다. GPS가 제대로 기록됐는지, 메타데이터가 정말 지워졌는지요.' },
      { t: '아이폰 사진도 그대로', d: '아이폰 HEIC 사진도 윈도우를 포함한 모든 도구에서 사용할 수 있습니다.' },
    ],
    faqTitle: '자주 묻는 질문',
    faqs: [
      { q: '정말 무료인가요?', a: '네. 모든 도구가 무료이며 계정, 구독, 워터마크가 없습니다.' },
      { q: '사진의 EXIF 정보는 어떻게 삭제하나요?', a: '‘EXIF 정보 삭제’를 열고 사진을 선택한 뒤 정리된 파일을 다운로드하면 됩니다. 위치, 카메라 정보, 날짜가 화질 손실 없이 지워집니다.' },
      { q: 'HEIC를 JPG로 바꾸려면 어떻게 하나요?', a: '‘HEIC → JPG 변환’ 도구에 사진을 끌어다 놓고 화질을 고른 뒤 다운로드하세요. 변환은 모두 브라우저에서 이루어집니다.' },
      { q: '사진이 서버에 업로드되나요?', a: '대부분의 도구는 업로드하지 않습니다. 위치 정보 추가와 PNG 압축만 서버를 쓰며, 파일은 메모리에서 처리된 뒤 바로 삭제됩니다.' },
    ],
    ctaTitle: '지금 사진에 위치 정보를 넣어 보세요',
    ctaText: 'GPS 좌표와 매장 정보를 몇 초 만에 사진에 기록할 수 있습니다. 무료입니다.',
    ctaButton: '지오태그 도구 열기',
  },
  ar: {
    answer: 'PinPixl مجموعة أدوات صور مجانية تعمل داخل متصفحك: إضافة الموقع إلى الصور، وعرض بيانات EXIF وحذفها، ومعرفة مكان التقاط الصورة، وتحويل HEIC إلى JPG، وضغط الصور، دون تسجيل ودون علامة مائية.',
    whyTitle: 'لماذا PinPixl؟',
    why: [
      { t: 'صورك تبقى معك', d: 'تعمل معظم الأدوات داخل متصفحك. وعندما نحتاج إلى الخادم لا نحتفظ بأي شيء.' },
      { t: 'نتائج مُتحقَّق منها', d: 'نفحص كل ملف قبل تنزيله: هل كُتب الموقع فعلًا؟ هل حُذفت البيانات الوصفية فعلًا؟' },
      { t: 'صور الآيفون مدعومة', d: 'صور HEIC من الآيفون تعمل في كل الأدوات، حتى على ويندوز.' },
    ],
    faqTitle: 'الأسئلة الشائعة',
    faqs: [
      { q: 'هل الأدوات مجانية فعلًا؟', a: 'نعم. كل الأدوات مجانية، بلا حساب ولا اشتراك ولا علامة مائية.' },
      { q: 'كيف أحذف بيانات EXIF من الصورة؟', a: 'افتح أداة «حذف بيانات EXIF»، واختر الصورة، ثم نزّل الملف النظيف. يُحذف الموقع وبيانات الكاميرا والتاريخ دون أي فقدان في الجودة.' },
      { q: 'كيف أحوّل HEIC إلى JPG؟', a: 'استخدم أداة «تحويل HEIC إلى JPG»: اسحب الصور، واختر الجودة، ثم نزّلها. يتم التحويل بالكامل داخل متصفحك.' },
      { q: 'هل تُرفع صوري إلى خادم؟', a: 'لا في معظم الأدوات. فقط إضافة الموقع وضغط PNG يستخدمان خادمنا، حيث يُعالج الملف في الذاكرة ثم يُحذف فورًا.' },
    ],
    ctaTitle: 'أضف الموقع إلى صورك الآن',
    ctaText: 'اكتب إحداثيات GPS وبيانات نشاطك التجاري داخل الصورة في ثوانٍ، مجانًا.',
    ctaButton: 'افتح أداة الوسم الجغرافي',
  },
  hi: {
    answer: 'PinPixl फ्री फोटो टूल्स का एक सेट है जो आपके ब्राउज़र में ही चलता है: फोटो में लोकेशन जोड़ना, EXIF डेटा देखना और हटाना, फोटो कहाँ ली गई पता करना, HEIC को JPG में बदलना और फोटो का साइज़ कम करना – बिना साइन-अप और बिना वॉटरमार्क।',
    whyTitle: 'PinPixl क्यों?',
    why: [
      { t: 'आपकी फोटो आपके पास', d: 'ज़्यादातर टूल आपके ब्राउज़र में ही काम करते हैं। जहाँ सर्वर चाहिए, वहाँ भी कुछ सेव नहीं होता।' },
      { t: 'जाँचा हुआ नतीजा', d: 'डाउनलोड से पहले हर फाइल चेक होती है: GPS सच में लिखा गया या नहीं, मेटाडेटा सच में हटा या नहीं।' },
      { t: 'iPhone की फोटो भी', d: 'iPhone की HEIC फोटो हर टूल में चलती हैं, Windows पर भी।' },
    ],
    faqTitle: 'अक्सर पूछे जाने वाले सवाल',
    faqs: [
      { q: 'क्या ये टूल सच में फ्री हैं?', a: 'हाँ। सारे टूल फ्री हैं – न अकाउंट, न सब्सक्रिप्शन, न वॉटरमार्क।' },
      { q: 'फोटो से EXIF डेटा कैसे हटाएं?', a: '“EXIF डेटा हटाएं” टूल खोलें, फोटो चुनें और साफ़ की हुई फाइल डाउनलोड करें। लोकेशन, कैमरा की जानकारी और तारीख बिना क्वालिटी घटाए हट जाती है।' },
      { q: 'HEIC को JPG में कैसे बदलें?', a: '“HEIC से JPG” टूल में फोटो खींचकर डालें, क्वालिटी चुनें और डाउनलोड करें। पूरा काम आपके ब्राउज़र में होता है।' },
      { q: 'क्या मेरी फोटो सर्वर पर अपलोड होती है?', a: 'ज़्यादातर टूल में नहीं। सिर्फ़ लोकेशन जोड़ना और PNG कंप्रेशन हमारे सर्वर पर होता है, जहाँ फाइल मेमोरी में प्रोसेस होकर तुरंत डिलीट हो जाती है।' },
    ],
    ctaTitle: 'अभी अपनी फोटो में लोकेशन जोड़ें',
    ctaText: 'GPS लोकेशन और बिज़नेस की जानकारी कुछ ही सेकंड में फोटो में लिखें – फ्री।',
    ctaButton: 'जियोटैग टूल खोलें',
  },
};

export const hubFor = (lang: string) => HUB[lang];
