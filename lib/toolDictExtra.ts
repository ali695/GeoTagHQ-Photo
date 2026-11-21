// Labels for the geotagging tool's location card, metadata summary and export
// selector. Merged over toolDict in GeoTaggingTool (same language keys).
type Extra = {
  fileSize: string; notAvailable: string; unknown: string; exportOriginal: string;
  street: string; state: string; postal: string;
  source: string; srcSearch: string; srcMap: string; srcManual: string; srcCurrent: string; srcSelected: string; via: string;
  exactMatch: string; approxMatch: string; houseNotFound: string;
  useLocDetails: string; useLocDetailsTitle: string; applyAllNote: string; seoSummary: string;
};

export const toolDictExtra: Record<string, Extra> = {
  en: {
    fileSize: 'File size', notAvailable: 'Not available', unknown: 'Unknown', exportOriginal: 'Keep original format',
    street: 'Street', state: 'State / region', postal: 'Postcode',
    source: 'Source', srcSearch: 'Address search', srcMap: 'Map click', srcManual: 'Manual entry', srcCurrent: 'Current location', srcSelected: 'Selected', via: 'via',
    exactMatch: 'Exact or close match', approxMatch: 'Approximate match', houseNotFound: 'The exact house number was not found, so the closest available location is shown.',
    useLocDetails: 'Use location details for metadata', useLocDetailsTitle: 'Copy the address details into the metadata fields',
    applyAllNote: 'This location is applied to every uploaded photo. Setting a different location per photo is not currently available.',
    seoSummary: 'Local SEO metadata',
  },
  de: {
    fileSize: 'Dateigröße', notAvailable: 'Nicht vorhanden', unknown: 'Unbekannt', exportOriginal: 'Originalformat beibehalten',
    street: 'Straße', state: 'Bundesland / Region', postal: 'PLZ',
    source: 'Quelle', srcSearch: 'Adresssuche', srcMap: 'Klick auf die Karte', srcManual: 'Manuelle Eingabe', srcCurrent: 'Aktueller Standort', srcSelected: 'Ausgewählt', via: 'über',
    exactMatch: 'Genaue oder nahe Übereinstimmung', approxMatch: 'Ungefähre Übereinstimmung', houseNotFound: 'Die genaue Hausnummer wurde nicht gefunden. Angezeigt wird der nächstgelegene verfügbare Ort.',
    useLocDetails: 'Ortsangaben für Metadaten übernehmen', useLocDetailsTitle: 'Adressangaben in die Metadatenfelder kopieren',
    applyAllNote: 'Dieser Ort wird auf alle hochgeladenen Fotos angewendet. Einen eigenen Ort pro Foto festzulegen ist derzeit nicht möglich.',
    seoSummary: 'Lokale SEO-Metadaten',
  },
  es: {
    fileSize: 'Tamaño del archivo', notAvailable: 'No disponible', unknown: 'Desconocido', exportOriginal: 'Mantener el formato original',
    street: 'Calle', state: 'Provincia / región', postal: 'Código postal',
    source: 'Origen', srcSearch: 'Búsqueda de dirección', srcMap: 'Clic en el mapa', srcManual: 'Entrada manual', srcCurrent: 'Ubicación actual', srcSelected: 'Seleccionado', via: 'vía',
    exactMatch: 'Coincidencia exacta o muy cercana', approxMatch: 'Coincidencia aproximada', houseNotFound: 'No se encontró el número exacto del portal, así que se muestra la ubicación más cercana disponible.',
    useLocDetails: 'Usar los datos de la ubicación en los metadatos', useLocDetailsTitle: 'Copiar la dirección en los campos de metadatos',
    applyAllNote: 'Esta ubicación se aplica a todas las fotos que subas. Por ahora no se puede asignar una ubicación distinta a cada foto.',
    seoSummary: 'Metadatos de SEO local',
  },
  fr: {
    fileSize: 'Taille du fichier', notAvailable: 'Non disponible', unknown: 'Inconnu', exportOriginal: 'Conserver le format d’origine',
    street: 'Rue', state: 'Région', postal: 'Code postal',
    source: 'Source', srcSearch: 'Recherche d’adresse', srcMap: 'Clic sur la carte', srcManual: 'Saisie manuelle', srcCurrent: 'Position actuelle', srcSelected: 'Sélectionné', via: 'via',
    exactMatch: 'Correspondance exacte ou proche', approxMatch: 'Correspondance approximative', houseNotFound: 'Le numéro exact n’a pas été trouvé : l’emplacement disponible le plus proche est affiché.',
    useLocDetails: 'Utiliser l’adresse pour les métadonnées', useLocDetailsTitle: 'Copier l’adresse dans les champs de métadonnées',
    applyAllNote: 'Cet emplacement s’applique à toutes les photos importées. Il n’est pas possible pour l’instant de définir un emplacement différent par photo.',
    seoSummary: 'Métadonnées SEO local',
  },
  pt: {
    fileSize: 'Tamanho do arquivo', notAvailable: 'Não disponível', unknown: 'Desconhecido', exportOriginal: 'Manter o formato original',
    street: 'Rua', state: 'Estado / região', postal: 'CEP',
    source: 'Origem', srcSearch: 'Busca por endereço', srcMap: 'Clique no mapa', srcManual: 'Digitação manual', srcCurrent: 'Localização atual', srcSelected: 'Selecionado', via: 'via',
    exactMatch: 'Correspondência exata ou próxima', approxMatch: 'Correspondência aproximada', houseNotFound: 'O número exato não foi encontrado, então mostramos o local mais próximo disponível.',
    useLocDetails: 'Usar os dados do local nos metadados', useLocDetailsTitle: 'Copiar o endereço para os campos de metadados',
    applyAllNote: 'Este local é aplicado a todas as fotos enviadas. Por enquanto não dá para definir um local diferente para cada foto.',
    seoSummary: 'Metadados de SEO local',
  },
  it: {
    fileSize: 'Dimensione del file', notAvailable: 'Non disponibile', unknown: 'Sconosciuto', exportOriginal: 'Mantieni il formato originale',
    street: 'Via', state: 'Regione / provincia', postal: 'CAP',
    source: 'Origine', srcSearch: 'Ricerca indirizzo', srcMap: 'Clic sulla mappa', srcManual: 'Inserimento manuale', srcCurrent: 'Posizione attuale', srcSelected: 'Selezionato', via: 'tramite',
    exactMatch: 'Corrispondenza esatta o vicina', approxMatch: 'Corrispondenza approssimativa', houseNotFound: 'Il numero civico esatto non è stato trovato: viene mostrata la posizione disponibile più vicina.',
    useLocDetails: 'Usa i dati del luogo nei metadati', useLocDetailsTitle: 'Copia l’indirizzo nei campi dei metadati',
    applyAllNote: 'Questa posizione viene applicata a tutte le foto caricate. Per ora non puoi impostare una posizione diversa per ogni foto.',
    seoSummary: 'Metadati SEO locale',
  },
  nl: {
    fileSize: 'Bestandsgrootte', notAvailable: 'Niet beschikbaar', unknown: 'Onbekend', exportOriginal: 'Origineel formaat behouden',
    street: 'Straat', state: 'Provincie / regio', postal: 'Postcode',
    source: 'Bron', srcSearch: 'Adres zoeken', srcMap: 'Klik op de kaart', srcManual: 'Handmatig ingevoerd', srcCurrent: 'Huidige locatie', srcSelected: 'Geselecteerd', via: 'via',
    exactMatch: 'Exacte of nauwe overeenkomst', approxMatch: 'Bij benadering', houseNotFound: 'Het exacte huisnummer is niet gevonden, dus je ziet de dichtstbijzijnde beschikbare locatie.',
    useLocDetails: 'Locatiegegevens gebruiken voor metadata', useLocDetailsTitle: 'Adresgegevens naar de metadatavelden kopiëren',
    applyAllNote: 'Deze locatie wordt op alle geüploade foto’s toegepast. Een aparte locatie per foto instellen kan op dit moment niet.',
    seoSummary: 'Lokale SEO-metadata',
  },
  tr: {
    fileSize: 'Dosya boyutu', notAvailable: 'Mevcut değil', unknown: 'Bilinmiyor', exportOriginal: 'Orijinal biçimi koru',
    street: 'Sokak', state: 'İl / bölge', postal: 'Posta kodu',
    source: 'Kaynak', srcSearch: 'Adres araması', srcMap: 'Haritaya tıklama', srcManual: 'Elle giriş', srcCurrent: 'Mevcut konum', srcSelected: 'Seçildi', via: 'üzerinden',
    exactMatch: 'Tam veya yakın eşleşme', approxMatch: 'Yaklaşık eşleşme', houseNotFound: 'Tam kapı numarası bulunamadı, bu yüzden en yakın konum gösteriliyor.',
    useLocDetails: 'Konum bilgilerini meta veriye aktar', useLocDetailsTitle: 'Adres bilgilerini meta veri alanlarına kopyala',
    applyAllNote: 'Bu konum yüklenen tüm fotoğraflara uygulanır. Her fotoğrafa ayrı konum atamak şu anda mümkün değil.',
    seoSummary: 'Yerel SEO meta verileri',
  },
  id: {
    fileSize: 'Ukuran file', notAvailable: 'Tidak tersedia', unknown: 'Tidak diketahui', exportOriginal: 'Pertahankan format asli',
    street: 'Jalan', state: 'Provinsi / wilayah', postal: 'Kode pos',
    source: 'Sumber', srcSearch: 'Pencarian alamat', srcMap: 'Klik di peta', srcManual: 'Input manual', srcCurrent: 'Lokasi saat ini', srcSelected: 'Dipilih', via: 'melalui',
    exactMatch: 'Cocok persis atau sangat dekat', approxMatch: 'Perkiraan lokasi', houseNotFound: 'Nomor rumah yang tepat tidak ditemukan, jadi lokasi terdekat yang tersedia ditampilkan.',
    useLocDetails: 'Gunakan detail lokasi untuk metadata', useLocDetailsTitle: 'Salin detail alamat ke kolom metadata',
    applyAllNote: 'Lokasi ini diterapkan ke semua foto yang Anda unggah. Saat ini belum bisa mengatur lokasi berbeda untuk tiap foto.',
    seoSummary: 'Metadata SEO lokal',
  },
  ja: {
    fileSize: 'ファイルサイズ', notAvailable: 'なし', unknown: '不明', exportOriginal: '元の形式のまま',
    street: '番地・通り', state: '都道府県', postal: '郵便番号',
    source: '取得方法', srcSearch: '住所検索', srcMap: '地図をクリック', srcManual: '手動入力', srcCurrent: '現在地', srcSelected: '選択済み', via: '提供:',
    exactMatch: '完全一致または近い一致', approxMatch: 'おおよその一致', houseNotFound: '正確な番地が見つからなかったため、最も近い場所を表示しています。',
    useLocDetails: '位置情報をメタデータに反映', useLocDetailsTitle: '住所情報をメタデータ欄にコピーします',
    applyAllNote: 'この位置はアップロードしたすべての写真に適用されます。写真ごとに別の位置を設定する機能は現在ありません。',
    seoSummary: 'ローカルSEOメタデータ',
  },
  ko: {
    fileSize: '파일 크기', notAvailable: '정보 없음', unknown: '알 수 없음', exportOriginal: '원본 형식 유지',
    street: '도로명', state: '시·도', postal: '우편번호',
    source: '출처', srcSearch: '주소 검색', srcMap: '지도 클릭', srcManual: '직접 입력', srcCurrent: '현재 위치', srcSelected: '선택됨', via: '제공:',
    exactMatch: '정확히 또는 거의 일치', approxMatch: '대략적인 위치', houseNotFound: '정확한 번지를 찾지 못해 가장 가까운 위치를 표시합니다.',
    useLocDetails: '위치 정보를 메타데이터에 사용', useLocDetailsTitle: '주소 정보를 메타데이터 항목에 복사합니다',
    applyAllNote: '이 위치는 업로드한 모든 사진에 적용됩니다. 사진마다 다른 위치를 지정하는 기능은 현재 지원되지 않습니다.',
    seoSummary: '로컬 SEO 메타데이터',
  },
  ar: {
    fileSize: 'حجم الملف', notAvailable: 'غير متوفر', unknown: 'غير معروف', exportOriginal: 'الاحتفاظ بالصيغة الأصلية',
    street: 'الشارع', state: 'المنطقة / المحافظة', postal: 'الرمز البريدي',
    source: 'المصدر', srcSearch: 'البحث عن عنوان', srcMap: 'نقرة على الخريطة', srcManual: 'إدخال يدوي', srcCurrent: 'الموقع الحالي', srcSelected: 'محدد', via: 'عبر',
    exactMatch: 'تطابق دقيق أو قريب', approxMatch: 'تطابق تقريبي', houseNotFound: 'لم يُعثر على رقم المبنى بالضبط، لذلك يظهر أقرب موقع متاح.',
    useLocDetails: 'استخدام بيانات الموقع في البيانات الوصفية', useLocDetailsTitle: 'نسخ بيانات العنوان إلى حقول البيانات الوصفية',
    applyAllNote: 'يُطبَّق هذا الموقع على كل الصور المرفوعة. لا يمكن حاليًا تحديد موقع مختلف لكل صورة.',
    seoSummary: 'بيانات السيو المحلي',
  },
  hi: {
    fileSize: 'फ़ाइल साइज़', notAvailable: 'उपलब्ध नहीं', unknown: 'अज्ञात', exportOriginal: 'मूल फ़ॉर्मैट रखें',
    street: 'गली / सड़क', state: 'राज्य', postal: 'पिन कोड',
    source: 'स्रोत', srcSearch: 'पता खोज', srcMap: 'मैप पर क्लिक', srcManual: 'खुद से डाला गया', srcCurrent: 'मौजूदा लोकेशन', srcSelected: 'चुना गया', via: 'के ज़रिए',
    exactMatch: 'सटीक या बहुत करीबी मिलान', approxMatch: 'अनुमानित मिलान', houseNotFound: 'सटीक मकान नंबर नहीं मिला, इसलिए सबसे नज़दीकी उपलब्ध लोकेशन दिखाई जा रही है।',
    useLocDetails: 'लोकेशन की जानकारी मेटाडेटा में भरें', useLocDetailsTitle: 'पते की जानकारी मेटाडेटा फ़ील्ड में कॉपी करें',
    applyAllNote: 'यह लोकेशन अपलोड की गई सभी फ़ोटो पर लगेगी। हर फ़ोटो के लिए अलग लोकेशन सेट करना अभी उपलब्ध नहीं है।',
    seoSummary: 'लोकल SEO मेटाडेटा',
  },
};
