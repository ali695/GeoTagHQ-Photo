import type { ToolPageContent } from '../toolPage';

// Natively written for German searchers. Target phrases:
// "Fotos geotaggen", "GPS-Daten zu Foto hinzufügen", "Standort zu Foto hinzufügen",
// "Geotagging Tool kostenlos", "EXIF-Daten bearbeiten", "Google Unternehmensprofil Fotos".
const de: ToolPageContent = {
  metaTitle: 'Fotos geotaggen: GPS-Daten kostenlos online hinzufügen',
  metaDescription:
    'Fotos kostenlos geotaggen: GPS-Daten, Titel und Firmendaten in JPG, PNG, WebP und HEIC schreiben. Ohne Anmeldung – ideal fürs Google Unternehmensprofil.',

  eyebrow: 'Kostenlos · Ohne Anmeldung · Ohne Wasserzeichen',
  h1: 'Fotos geotaggen: GPS-Daten kostenlos zu Bildern hinzufügen',
  subtitle:
    'Ort auf der Karte wählen, Firmendaten eintragen und Fotos mit GPS-Koordinaten in den EXIF-Daten herunterladen. Für JPG, PNG, WebP, HEIC und mehr – bis zu 10 Bilder auf einmal.',
  trustChips: ['100 % kostenlos', 'Bis zu 10 Fotos gleichzeitig', 'Fotos werden nicht gespeichert', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Jetzt Fotos geotaggen',
  ctaSecondary: 'So funktioniert es',

  stepsTitle: 'GPS-Daten zu einem Foto hinzufügen – in 4 Schritten',
  stepsIntro: 'Sie brauchen weder Lightroom noch ExifTool oder eine App. Alles passiert direkt auf dieser Seite.',
  steps: [
    { title: 'Fotos hochladen', desc: 'Ziehen Sie bis zu 10 Bilder in das Feld oder fügen Sie eine Webseiten-URL ein, um deren Bilder zu importieren. Vorhandene EXIF-Daten werden sofort angezeigt.' },
    { title: 'Standort festlegen', desc: 'Suchen Sie nach Adresse, Firmenname oder Sehenswürdigkeit, verschieben Sie die Markierung oder geben Sie Breiten- und Längengrad ein.' },
    { title: 'Firmendaten ergänzen', desc: 'Titel, Beschreibung, Stichwörter und Firmenname eintragen. Straße, Ort und PLZ werden aus dem gewählten Standort automatisch übernommen.' },
    { title: 'Anwenden und herunterladen', desc: 'Format und Komprimierung wählen, auf Anwenden klicken und die Fotos einzeln oder gesammelt als ZIP herunterladen.' },
  ],

  featuresTitle: 'Alles, was Sie zum Geotaggen von Fotos brauchen',
  featuresIntro: 'Gemacht für Selbstständige, Handwerksbetriebe, SEO-Agenturen und Fotografen, die Standortdaten schnell in ihre Bilder schreiben wollen.',
  features: [
    { title: 'Kartensuche nach Adresse', desc: 'Jede Straße, jeden Ort oder jedes Unternehmen finden und die Markierung bis aufs Gebäude genau setzen.' },
    { title: 'Exakte Koordinaten', desc: 'Breiten- und Längengrad direkt eingeben, wenn Sie den Standort bereits kennen.' },
    { title: 'Mehrere Fotos auf einmal', desc: 'Bis zu 10 Bilder mit demselben Standort versehen oder Metadaten für ein einzelnes Bild anpassen.' },
    { title: 'Metadaten für lokales SEO', desc: 'Titel, Beschreibung, Stichwörter und Firmenname in EXIF-Felder schreiben, die Windows und gängige Bildprogramme anzeigen.' },
    { title: 'Umwandeln und komprimieren', desc: 'Als JPG, PNG, WebP, AVIF oder TIFF exportieren und die Dateigröße für schnellere Webseiten verringern.' },
    { title: 'Bilder per URL importieren', desc: 'Bilder direkt von einer öffentlichen Webseite oder einem Bildlink übernehmen, ohne sie vorher herunterzuladen.' },
    { title: 'Zuschneiden und bearbeiten', desc: 'Fotos vor dem Geotaggen auf ein festes Seitenverhältnis oder frei zuschneiden.' },
  ],

  metadataTitle: 'Welche EXIF-Daten das Tool in Ihr Foto schreibt',
  metadataIntro: 'Beim Geotagging wird der Standort direkt in der Bilddatei gespeichert, in den sogenannten EXIF-Metadaten. Das schreibt PinPixl konkret:',
  metadataHeaders: ['Angabe', 'EXIF-Feld', 'Beispiel'],
  metadataRows: [
    { field: 'GPS-Standort', example: '48.1351° N, 11.5820° O' },
    { field: 'Titel', example: 'Frische Brezen aus unserer Bäckerei in München' },
    { field: 'Beschreibung', example: 'Unsere Backstube am frühen Morgen in Schwabing.' },
    { field: 'Stichwörter', example: 'Bäckerei, Brezen, München' },
    { field: 'Firmenname', example: 'Ihr Firmenname' },
    { field: 'Ort, Land und mehr', example: 'City: München; Country: Deutschland' },
    { field: 'Aufnahmedatum, Kamera', example: '2026:11:18 07:30:00' },
  ],
  metadataNote: 'JPG liefert die zuverlässigsten Ergebnisse. Andere Formate werden umgewandelt; ob alle Felder erhalten bleiben, hängt von der Plattform ab, auf die Sie das Bild hochladen.',

  useCasesTitle: 'Für wen lohnt es sich, Fotos zu geotaggen?',
  useCases: [
    { title: 'Inhaber eines Google Unternehmensprofils', desc: 'Fotos von Ladenlokal, Team und Arbeiten mit einheitlichen Standortangaben vorbereiten, bevor Sie sie hochladen.' },
    { title: 'SEO- und Marketingagenturen', desc: 'Kundenfotos stapelweise mit passendem Firmennamen, Stichwörtern und Adresse je Standort versehen.' },
    { title: 'Immobilienmakler', desc: 'Festhalten, wo jedes Objektfoto aufgenommen wurde, damit Exposés und Archive geordnet bleiben.' },
    { title: 'Handwerker und Dienstleister', desc: 'Belegen, wo ein Auftrag ausgeführt wurde: Vorher-nachher-Fotos tragen den Standort der Baustelle.' },
    { title: 'Fotografen und Reisende', desc: 'Bildern aus Kameras ohne GPS einen Ort geben, damit sie in Google Fotos, Apple Fotos oder Lightroom auf der Karte erscheinen.' },
    { title: 'Webseitenbetreiber', desc: 'Bilder für schnellere Ladezeiten verkleinern und umwandeln, ohne aussagekräftige Metadaten zu verlieren.' },
  ],

  seoTitle: 'Bringt Geotagging von Fotos etwas für lokales SEO? Die ehrliche Antwort',
  seoParagraphs: [
    'Geotagging wird oft als Ranking-Trick verkauft. Das ist es nicht. Google hat nie bestätigt, dass GPS-Daten in Bildern ein Rankingfaktor sind, und bei Fotos im Google Unternehmensprofil werden die EXIF-Daten beim Veröffentlichen entfernt.',
    'Warum also geotaggen? Weil Standortdaten Ihr Bildarchiv ordentlich halten, Foto-Apps und Karten Ihre Bilder richtig zuordnen und Dateien auf Ihrer eigenen Webseite und in Verzeichnissen eine weitere einheitliche Standortangabe erhalten. Sehen Sie es als saubere Grundlage für lokales SEO, nicht als Ersatz dafür.',
    'Was für die lokale Suche nachweislich zählt, sehen Menschen und Google direkt: echte Fotos Ihres Betriebs, sprechende Dateinamen, hilfreiche Alt-Texte und überall identische Angaben zu Name, Adresse und Telefonnummer.',
  ],
  seoChecklistTitle: 'Checkliste für Bilder im lokalen SEO',
  seoChecklist: [
    'Echte Fotos von Räumen, Team und Arbeiten statt Stockbilder verwenden.',
    'Dateien aussagekräftig benennen, z. B. baeckerei-muenchen-brezen.jpg statt IMG_4521.jpg.',
    'Alt-Texte schreiben, die beschreiben, was zu sehen ist – keine Keyword-Listen.',
    'Bilder komprimieren, damit die Seite auf dem Smartphone schnell lädt.',
    'Regelmäßig neue Fotos im Google Unternehmensprofil veröffentlichen.',
    'Name, Adresse und Telefonnummer auf Webseite und in allen Einträgen identisch halten.',
  ],

  privacyTitle: 'So gehen wir mit Ihren Fotos um',
  privacyParagraphs: [
    'Um Metadaten zu schreiben und Formate umzuwandeln, wird Ihr Foto über eine verschlüsselte Verbindung an unseren Server gesendet, im Arbeitsspeicher verarbeitet und als Download an Sie zurückgegeben. Wir speichern keine Fotos, behalten keine Kopien und nutzen sie für nichts anderes.',
    'Es gibt kein Konto, also verknüpft nichts Ihre Fotos mit Ihrer Person. Die Standortsuche nutzt öffentliche Kartendaten.',
  ],

  formatsTitle: 'Unterstützte Bildformate',
  formats: [
    { format: 'JPG / JPEG', support: 'Voll', note: 'Die beste Wahl. GPS und alle Textfelder werden überall unterstützt.' },
    { format: 'PNG', support: 'Gut', note: 'GPS wird geschrieben, aber manche Webseiten und Apps ignorieren PNG-Metadaten.' },
    { format: 'WebP', support: 'Gut', note: 'Kleine Dateien für Webseiten. Die Unterstützung der Metadaten hängt von der Plattform ab.' },
    { format: 'HEIC / HEIF', support: 'Umgewandelt', note: 'iPhone-Fotos. Für die größte Kompatibilität als JPG exportieren.' },
    { format: 'AVIF, TIFF', support: 'Umgewandelt', note: 'Werden angenommen und exportiert. Prüfen Sie, ob Ihre Zielplattform die Metadaten liest.' },
  ],

  faqTitle: 'Häufige Fragen zum Geotaggen von Fotos',
  faqSubtitle: 'Antworten rund um GPS-Daten, EXIF und Standortangaben in Bildern.',
  faqs: [
    { q: 'Wie füge ich einem Foto GPS-Daten hinzu?', a: 'Laden Sie das Foto oben hoch, suchen Sie die Adresse oder verschieben Sie die Markierung auf der Karte und klicken Sie auf Anwenden. Das Tool schreibt die Koordinaten in die EXIF-Daten, und Sie laden das geotaggte Foto herunter. Das dauert weniger als eine Minute.' },
    { q: 'Ist das Geotagging Tool wirklich kostenlos?', a: 'Ja. Es gibt keine Anmeldung, kein Wasserzeichen und kein Bezahlmodell. Sie können bis zu 10 Fotos pro Durchgang mit je bis zu 10 MB bearbeiten.' },
    { q: 'Verbessern geotaggte Fotos mein Google-Ranking?', a: 'Nicht direkt. Google hat GPS-Daten in Bildern nie als Rankingfaktor bestätigt, und das Google Unternehmensprofil entfernt EXIF-Daten aus veröffentlichten Fotos. Geotagging hilft beim Ordnen und bei einheitlichen Standortangaben – echte Fotos, gute Dateinamen und Alt-Texte sind aber wichtiger.' },
    { q: 'Sollte ich Fotos vor dem Hochladen ins Google Unternehmensprofil geotaggen?', a: 'Es schadet nicht und hält Ihre Originaldateien geordnet. Erwarten Sie davon aber keinen Ranking-Schub. Wichtiger ist, regelmäßig echte, aktuelle und gute Fotos hochzuladen.' },
    { q: 'Wie kann ich EXIF-Daten online bearbeiten?', a: 'Mit PinPixl bearbeiten Sie GPS-Standort, Titel, Beschreibung, Stichwörter, Firmenname, Aufnahmedatum und Kamera direkt im Browser-Formular und laden die Datei mit den neuen EXIF-Daten herunter – ohne Software-Installation.' },
    { q: 'Werden meine Fotos gespeichert?', a: 'Nein. Die Fotos werden nur im Arbeitsspeicher unseres Servers verarbeitet, um die Metadaten zu schreiben und das Format umzuwandeln, und dann an Sie zurückgegeben. Sie werden weder gespeichert noch weitergegeben.' },
    { q: 'Wie sehe ich, ob ein Foto GPS-Daten enthält?', a: 'Laden Sie es ins Tool hoch – vorhandene Metadaten werden sofort angezeigt. Unter Windows: Rechtsklick auf die Datei, Eigenschaften, Details. Auf dem Mac: in Vorschau öffnen und Werkzeuge › Informationen einblenden wählen.' },
    { q: 'Kann ich iPhone-Fotos im HEIC-Format geotaggen?', a: 'Ja. HEIC- und HEIF-Dateien werden unterstützt. Für die beste Kompatibilität exportieren Sie sie als JPG.' },
    { q: 'Kann ich mehrere Fotos gleichzeitig geotaggen?', a: 'Ja. Laden Sie bis zu 10 Fotos hoch, legen Sie einen Standort fest und wenden Sie ihn auf alle an. Anschließend laden Sie alles als ZIP herunter. Einzelne Fotos können Sie trotzdem separat anpassen.' },
    { q: 'Verliert mein Foto beim Geotaggen an Qualität?', a: 'Nein, solange Sie keine Komprimierung und kein anderes Format wählen. Mit Komprimierung „Keine“ und Originalformat ändern sich nur die Metadaten.' },
  ],

  finalCtaTitle: 'Bereit, Ihre Fotos zu geotaggen?',
  finalCtaText: 'Kostenlos, ohne Anmeldung und in unter einer Minute erledigt.',
  finalCtaButton: 'Jetzt starten',
};

export default de;
