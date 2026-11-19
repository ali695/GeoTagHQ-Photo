const fs = require('fs');
const path = require('path');

const extras = {
  "en": { "exportFormat": "Export Format", "showingMetadataFirstOnly": "Showing metadata for first photo only", "editCropImage": "Edit & Crop Image", "cropFree": "Free", "applyEdits": "Apply Edits" },
  "fr": { "exportFormat": "Format d'exportation", "showingMetadataFirstOnly": "Affichage des métadonnées pour la première photo uniquement", "editCropImage": "Modifier et recadrer l'image", "cropFree": "Libre", "applyEdits": "Appliquer les modifications" },
  "es": { "exportFormat": "Formato de exportación", "showingMetadataFirstOnly": "Mostrando metadatos solo de la primera foto", "editCropImage": "Editar y recortar imagen", "cropFree": "Libre", "applyEdits": "Aplicar cambios" },
  "de": { "exportFormat": "Exportformat", "showingMetadataFirstOnly": "Metadaten nur für das erste Foto anzeigen", "editCropImage": "Bild bearbeiten & zuschneiden", "cropFree": "Frei", "applyEdits": "Änderungen anwenden" },
  "it": { "exportFormat": "Formato di esportazione", "showingMetadataFirstOnly": "Mostra i metadati solo della prima foto", "editCropImage": "Modifica e ritaglia", "cropFree": "Libero", "applyEdits": "Applica modifiche" },
  "pt": { "exportFormat": "Formato de Exportação", "showingMetadataFirstOnly": "Mostrando metadados apenas da primeira foto", "editCropImage": "Editar e cortar imagem", "cropFree": "Livre", "applyEdits": "Aplicar Edições" },
  "nl": { "exportFormat": "Exportformaat", "showingMetadataFirstOnly": "Toont metagegevens alleen voor de eerste foto", "editCropImage": "Afbeelding bewerken en bijsnijden", "cropFree": "Vrij", "applyEdits": "Bewerkingen toepassen" },
  "tr": { "exportFormat": "Dışa Aktarım Formatı", "showingMetadataFirstOnly": "Yalnızca ilk fotoğraf için meta verileri gösteriliyor", "editCropImage": "Resmi Düzenle ve Kırp", "cropFree": "Serbest", "applyEdits": "Düzenlemeleri Uygula" },
  "ar": { "exportFormat": "تنسيق التصدير", "showingMetadataFirstOnly": "إظهار البيانات الوصفية للصورة الأولى فقط", "editCropImage": "تعديل وقص الصورة", "cropFree": "حر", "applyEdits": "تطبيق التعديلات" },
  "hi": { "exportFormat": "निर्यात प्रारूप", "showingMetadataFirstOnly": "केवल पहली तस्वीर के लिए मेटाडेटा दिखा रहा है", "editCropImage": "छवि संपादित और क्रॉप करें", "cropFree": "मुक्त", "applyEdits": "संपादनों को लागू करें" },
  "id": { "exportFormat": "Format Ekspor", "showingMetadataFirstOnly": "Menampilkan metadata untuk foto pertama saja", "editCropImage": "Sunting & Pangkas Gambar", "cropFree": "Bebas", "applyEdits": "Terapkan Editan" },
  "ja": { "exportFormat": "エクスポート形式", "showingMetadataFirstOnly": "最初の写真のメタデータのみ表示", "editCropImage": "画像を編集してトリミング", "cropFree": "フリー", "applyEdits": "編集を適用" },
  "ko": { "exportFormat": "내보내기 형식", "showingMetadataFirstOnly": "첫 번째 사진의 메타데이터만 표시", "editCropImage": "이미지 편집 및 자르기", "cropFree": "자유형", "applyEdits": "편집 적용" }
};

const msgDir = path.join(__dirname, 'messages');
fs.readdirSync(msgDir).forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const p = path.join(msgDir, file);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    
    if (!data.tool) data.tool = {};
    const ext = extras[lang] || extras['en'];
    Object.assign(data.tool, ext);
    
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang} with extra translations`);
  }
});
