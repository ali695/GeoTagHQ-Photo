// "Quick facts" panel and author byline on every tool page, written natively per language.
// Short, factual statements are what AI answers (Google AI Overviews, ChatGPT, Perplexity) quote.
export type FactsDict = {
  title: string;
  price: string; priceVal: string;
  signup: string; signupVal: string;
  files: string; browserVal: string; mixedVal: string; serverVal: string;
  batch: string; batchVal: string;
  works: string; worksVal: string;
  by: string; role: string; updated: string;
};

export const FACTS: Record<string, FactsDict> = {
  en: {
    title: 'Quick facts', price: 'Price', priceVal: 'Free, no paid plan', signup: 'Sign-up', signupVal: 'Not needed',
    files: 'Your files', browserVal: 'Stay on your device, never uploaded', mixedVal: 'Stay on your device; only PNG compression uses our server (never stored)', serverVal: 'Processed in memory on our server and deleted right away',
    batch: 'Batch', batchVal: 'Up to 20 files at once', works: 'Works on', worksVal: 'Any modern browser on iPhone, Android, Windows and Mac',
    by: 'By', role: 'SEO Specialist', updated: 'Updated',
  },
  de: {
    title: 'Das Wichtigste in Kürze', price: 'Preis', priceVal: 'Kostenlos, kein Abo', signup: 'Anmeldung', signupVal: 'Nicht nötig',
    files: 'Ihre Dateien', browserVal: 'Bleiben auf Ihrem Gerät, kein Upload', mixedVal: 'Bleiben auf Ihrem Gerät; nur die PNG-Komprimierung läuft über unseren Server (ohne Speicherung)', serverVal: 'Werden im Arbeitsspeicher unseres Servers verarbeitet und sofort gelöscht',
    batch: 'Stapel', batchVal: 'Bis zu 20 Dateien auf einmal', works: 'Funktioniert auf', worksVal: 'Jedem aktuellen Browser auf iPhone, Android, Windows und Mac',
    by: 'Von', role: 'SEO-Spezialist', updated: 'Aktualisiert',
  },
  es: {
    title: 'Datos clave', price: 'Precio', priceVal: 'Gratis, sin planes de pago', signup: 'Registro', signupVal: 'No hace falta',
    files: 'Tus archivos', browserVal: 'Se quedan en tu dispositivo, no se suben', mixedVal: 'Se quedan en tu dispositivo; solo la compresión de PNG usa nuestro servidor (sin guardar nada)', serverVal: 'Se procesan en la memoria de nuestro servidor y se borran al momento',
    batch: 'Por lotes', batchVal: 'Hasta 20 archivos a la vez', works: 'Funciona en', worksVal: 'Cualquier navegador actual en iPhone, Android, Windows y Mac',
    by: 'Por', role: 'Especialista SEO', updated: 'Actualizado',
  },
  fr: {
    title: 'L’essentiel', price: 'Prix', priceVal: 'Gratuit, sans abonnement', signup: 'Inscription', signupVal: 'Inutile',
    files: 'Vos fichiers', browserVal: 'Restent sur votre appareil, aucun envoi', mixedVal: 'Restent sur votre appareil ; seule la compression PNG passe par notre serveur (rien n’est conservé)', serverVal: 'Traités en mémoire sur notre serveur, puis supprimés aussitôt',
    batch: 'Par lot', batchVal: 'Jusqu’à 20 fichiers à la fois', works: 'Compatible', worksVal: 'Tout navigateur récent sur iPhone, Android, Windows et Mac',
    by: 'Par', role: 'Spécialiste SEO', updated: 'Mis à jour',
  },
  pt: {
    title: 'Em resumo', price: 'Preço', priceVal: 'Grátis, sem plano pago', signup: 'Cadastro', signupVal: 'Não precisa',
    files: 'Seus arquivos', browserVal: 'Ficam no seu aparelho, sem envio', mixedVal: 'Ficam no seu aparelho; só a compressão de PNG usa nosso servidor (nada é guardado)', serverVal: 'Processados na memória do nosso servidor e apagados na hora',
    batch: 'Em lote', batchVal: 'Até 20 arquivos de uma vez', works: 'Funciona em', worksVal: 'Qualquer navegador atual no iPhone, Android, Windows e Mac',
    by: 'Por', role: 'Especialista em SEO', updated: 'Atualizado',
  },
  it: {
    title: 'In breve', price: 'Prezzo', priceVal: 'Gratis, nessun abbonamento', signup: 'Registrazione', signupVal: 'Non serve',
    files: 'I tuoi file', browserVal: 'Restano sul tuo dispositivo, nessun caricamento', mixedVal: 'Restano sul tuo dispositivo; solo la compressione PNG usa il nostro server (senza salvare nulla)', serverVal: 'Elaborati nella memoria del nostro server e cancellati subito',
    batch: 'In blocco', batchVal: 'Fino a 20 file alla volta', works: 'Funziona su', worksVal: 'Qualsiasi browser recente su iPhone, Android, Windows e Mac',
    by: 'Di', role: 'Specialista SEO', updated: 'Aggiornato',
  },
  nl: {
    title: 'In het kort', price: 'Prijs', priceVal: 'Gratis, geen abonnement', signup: 'Account', signupVal: 'Niet nodig',
    files: 'Je bestanden', browserVal: 'Blijven op je apparaat, geen upload', mixedVal: 'Blijven op je apparaat; alleen PNG-compressie gaat via onze server (er wordt niets bewaard)', serverVal: 'Worden in het geheugen van onze server verwerkt en meteen gewist',
    batch: 'Meerdere tegelijk', batchVal: 'Tot 20 bestanden in één keer', works: 'Werkt op', worksVal: 'Elke moderne browser op iPhone, Android, Windows en Mac',
    by: 'Door', role: 'SEO-specialist', updated: 'Bijgewerkt',
  },
  tr: {
    title: 'Kısaca', price: 'Ücret', priceVal: 'Ücretsiz, abonelik yok', signup: 'Üyelik', signupVal: 'Gerekmez',
    files: 'Dosyalarınız', browserVal: 'Cihazınızda kalır, yüklenmez', mixedVal: 'Cihazınızda kalır; yalnızca PNG sıkıştırma sunucumuzu kullanır (hiçbir şey saklanmaz)', serverVal: 'Sunucumuzun belleğinde işlenir ve hemen silinir',
    batch: 'Toplu işlem', batchVal: 'Tek seferde 20 dosyaya kadar', works: 'Uyumlu', worksVal: 'iPhone, Android, Windows ve Mac’te güncel tüm tarayıcılar',
    by: 'Hazırlayan', role: 'SEO Uzmanı', updated: 'Güncellendi',
  },
  id: {
    title: 'Info singkat', price: 'Harga', priceVal: 'Gratis, tanpa langganan', signup: 'Daftar akun', signupVal: 'Tidak perlu',
    files: 'File Anda', browserVal: 'Tetap di perangkat Anda, tidak diunggah', mixedVal: 'Tetap di perangkat Anda; hanya kompresi PNG yang memakai server kami (tidak disimpan)', serverVal: 'Diproses di memori server kami lalu langsung dihapus',
    batch: 'Sekaligus', batchVal: 'Hingga 20 file sekaligus', works: 'Bisa dipakai di', worksVal: 'Browser modern apa pun di iPhone, Android, Windows, dan Mac',
    by: 'Oleh', role: 'Spesialis SEO', updated: 'Diperbarui',
  },
  ja: {
    title: 'ポイントまとめ', price: '料金', priceVal: '無料・有料プランなし', signup: '登録', signupVal: '不要',
    files: 'ファイルの扱い', browserVal: '端末内で処理、アップロードなし', mixedVal: '端末内で処理。PNG圧縮のみサーバーを使用（保存はしません）', serverVal: 'サーバーのメモリ上で処理し、すぐに削除',
    batch: '一括処理', batchVal: '最大20ファイルまで', works: '対応環境', worksVal: 'iPhone・Android・Windows・Macの最新ブラウザ',
    by: '作成', role: 'SEOスペシャリスト', updated: '更新',
  },
  ko: {
    title: '한눈에 보기', price: '가격', priceVal: '무료, 유료 플랜 없음', signup: '회원가입', signupVal: '필요 없음',
    files: '파일 처리', browserVal: '기기 안에서 처리, 업로드 없음', mixedVal: '기기 안에서 처리, PNG 압축만 서버 사용(저장하지 않음)', serverVal: '서버 메모리에서 처리 후 바로 삭제',
    batch: '일괄 처리', batchVal: '한 번에 최대 20개', works: '지원 환경', worksVal: '아이폰·안드로이드·윈도우·맥의 최신 브라우저',
    by: '제작', role: 'SEO 전문가', updated: '업데이트',
  },
  ar: {
    title: 'باختصار', price: 'السعر', priceVal: 'مجاني، بلا اشتراكات', signup: 'التسجيل', signupVal: 'غير مطلوب',
    files: 'ملفاتك', browserVal: 'تبقى على جهازك ولا تُرفع', mixedVal: 'تبقى على جهازك؛ ضغط PNG وحده يتم على خادمنا (دون حفظ)', serverVal: 'تُعالج في ذاكرة خادمنا وتُحذف فورًا',
    batch: 'دفعة واحدة', batchVal: 'حتى 20 ملفًا في المرة', works: 'يعمل على', worksVal: 'أي متصفح حديث على آيفون وأندرويد وويندوز وماك',
    by: 'إعداد', role: 'أخصائي SEO', updated: 'آخر تحديث',
  },
  hi: {
    title: 'एक नज़र में', price: 'कीमत', priceVal: 'फ्री, कोई पेड प्लान नहीं', signup: 'साइन-अप', signupVal: 'ज़रूरी नहीं',
    files: 'आपकी फाइलें', browserVal: 'आपके डिवाइस पर ही रहती हैं, अपलोड नहीं होतीं', mixedVal: 'आपके डिवाइस पर रहती हैं; सिर्फ़ PNG कंप्रेशन हमारे सर्वर पर होता है (सेव नहीं होता)', serverVal: 'हमारे सर्वर की मेमोरी में प्रोसेस होकर तुरंत डिलीट हो जाती हैं',
    batch: 'एक साथ', batchVal: 'एक बार में 20 फाइलें तक', works: 'कहाँ चलता है', worksVal: 'iPhone, Android, Windows और Mac के किसी भी नए ब्राउज़र में',
    by: 'लेखक', role: 'SEO स्पेशलिस्ट', updated: 'अपडेट',
  },
};

export const factsFor = (lang: string) => FACTS[lang] || FACTS.en;
