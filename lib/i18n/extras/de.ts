import type { ToolExtras } from '../types';

// German long-form sections, written natively (not translated from English).
const de: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'Was sind EXIF-Daten überhaupt?',
        paragraphs: [
          'EXIF steht für „Exchangeable Image File Format“. Jede Kamera und jedes Smartphone schreibt beim Auslösen unsichtbare Zusatzinfos in die Bilddatei: Gerät, Objektiv, Blende, Belichtungszeit, ISO, Datum und Uhrzeit – und bei eingeschalteten Ortungsdiensten auch die genauen GPS-Koordinaten.',
          'Dazu kommen oft XMP- und IPTC-Daten aus Lightroom, Photoshop oder anderen Programmen: Titel, Bildbeschreibung, Stichwörter, Urheber und Copyright. Der EXIF-Viewer zeigt Ihnen all das auf einen Blick, statt nur die paar Felder, die Windows unter „Eigenschaften“ anzeigt.',
        ],
      },
      {
        title: 'Warum manche Fotos keine Metadaten haben',
        paragraphs: [
          'Lädt man ein Foto bei WhatsApp, Facebook, Instagram oder X hoch, werden die Metadaten fast immer entfernt – aus Datenschutzgründen und um Speicher zu sparen. Ein Bild, das Sie aus einem Chat speichern, hat deshalb meist keine Kamera- und keine Standortdaten mehr.',
          'Auch Screenshots, gescannte Dokumente und viele bearbeitete Bilder enthalten kaum EXIF-Daten. Wollen Sie wissen, was wirklich in einem Foto steckt, nehmen Sie immer die Originaldatei vom Handy oder von der Kamera.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Wie genau ist der Standort im Foto?',
        paragraphs: [
          'Das Tool liest die GPS-Koordinaten, die Ihr Handy beim Fotografieren gespeichert hat – es rät den Ort nicht anhand des Bildinhalts. Im Freien liegt der gespeicherte Punkt meist 5 bis 20 Meter neben der echten Position.',
          'In Innenräumen, in engen Straßen mit hohen Häusern oder direkt nach dem Einschalten des Handys kann die Abweichung größer sein, weil das GPS-Signal schwach ist oder reflektiert wird. Mit der Satellitenansicht erkennen Sie schnell, ob der Punkt plausibel ist.',
        ],
      },
      {
        title: 'Schützen Sie Ihren eigenen Standort',
        paragraphs: [
          'Was für fremde Fotos praktisch ist, kann bei Ihren eigenen zum Problem werden: Wer ein Originalfoto per E-Mail, Cloud-Link oder AirDrop erhält, sieht unter Umständen genau, wo Sie wohnen oder wo Ihre Kinder zur Schule gehen.',
          'Bevor Sie Fotos verkaufen, auf Kleinanzeigen stellen oder öffentlich teilen, entfernen Sie den Standort am besten mit unserem Tool „EXIF-Daten entfernen“ – das dauert nur Sekunden.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Verlustfrei: Das Bild selbst bleibt unangetastet',
        paragraphs: [
          'Viele Online-Tools speichern das ganze Bild neu und verschlechtern es dabei jedes Mal ein wenig. Bei JPG, PNG und WebP schneiden wir dagegen nur die Metadaten-Blöcke aus der Datei heraus – die eigentlichen Bilddaten bleiben Bit für Bit gleich.',
          'Zwei Ausnahmen: Fotos, die nur über das Ausrichtungs-Tag richtig herum angezeigt werden, speichern wir aufrecht neu, damit sie danach nicht auf der Seite liegen. Und iPhone-HEIC-Fotos werden als JPG gespeichert, weil Browser kein HEIC schreiben können.',
        ],
      },
      {
        title: 'Was genau entfernt wird',
        bullets: [
          'EXIF: GPS-Standort, Kameramodell, Objektiv, Aufnahmeeinstellungen, Datum, Software, Seriennummern und Vorschaubild.',
          'XMP: Bearbeitungsverlauf, Bewertungen, Stichwörter und Ortsangaben aus Programmen wie Lightroom.',
          'IPTC: Bildunterschrift, Urheber, Copyright und Kontaktdaten.',
          'Kommentare und Text-Chunks in PNG-Dateien.',
          'Erhalten bleibt das Farbprofil (ICC), damit die Farben genauso aussehen wie vorher.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Breitengrad und Längengrad einfach erklärt',
        paragraphs: [
          'Der Breitengrad gibt an, wie weit ein Ort nördlich oder südlich des Äquators liegt (−90° bis +90°). Der Längengrad beschreibt die Lage östlich oder westlich des Nullmeridians von Greenwich (−180° bis +180°). Zusammen ergeben sie die Geokoordinaten eines Punkts.',
          'Es gibt zwei gängige Schreibweisen: Dezimalgrad wie 52.520008, 13.404954 – so arbeiten Google Maps und die meisten Apps – und Grad, Minuten, Sekunden wie 52°31\'12.0" N 13°24\'17.8" E, wie man sie von Wanderkarten und aus der Seefahrt kennt.',
        ],
      },
      {
        title: 'Wofür man Koordinaten braucht',
        bullets: [
          'Den genauen Standort im Google Unternehmensprofil, in Branchenbüchern oder bei Lieferdiensten hinterlegen.',
          'Kunden oder Handwerkern einen Treffpunkt oder eine Baustelle ohne Hausnummer schicken.',
          'Fotos geotaggen: Koordinaten kopieren und in unser Geotagging-Tool einfügen.',
          'Prüfen, wo genau Koordinaten liegen, die Ihnen jemand geschickt hat.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Warum Bilder komprimieren?',
        bullets: [
          'Bilder sind meist der größte Teil einer Webseite. Kleinere Dateien bedeuten schnellere Ladezeiten und bessere Core Web Vitals.',
          'Viele E-Mail-Anbieter und Upload-Formulare begrenzen die Dateigröße.',
          'Online-Shops, Kleinanzeigen und das Google Unternehmensprofil verarbeiten kleinere Bilder schneller.',
          'Sie sparen Speicherplatz und Ihre Besucher mobiles Datenvolumen.',
        ],
      },
      {
        title: 'So funktioniert die PNG-Komprimierung',
        paragraphs: [
          'PNG ist verlustfrei, deshalb kann ein Browser es kaum kleiner machen. Bleibt Ihre Datei PNG, reduziert unser Server sie auf eine optimierte Farbpalette – dieselbe Technik, die bekannte PNG-Kompressoren nutzen. Das spart oft 60 bis 80 % bei kaum sichtbarem Unterschied.',
          'Die Datei wird dabei nur im Arbeitsspeicher verarbeitet und nicht gespeichert. Wenn Sie ganz ohne Server arbeiten möchten, wählen Sie als Ausgabeformat WebP: Das läuft komplett im Browser und ist meist noch kleiner.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'So speichert Ihr iPhone gleich JPG statt HEIC',
        paragraphs: [
          'Wenn Sie lieber direkt JPG-Fotos haben möchten, öffnen Sie auf dem iPhone Einstellungen › Kamera › Formate und wählen „Maximale Kompatibilität“. Neue Fotos werden dann als JPG gespeichert – vorhandene bleiben HEIC, dafür ist dieser Konverter da.',
          'Tipp: Beim Teilen per AirDrop oder E-Mail wandelt iOS Fotos oft automatisch in JPG um. Kopieren Sie Bilder dagegen per Kabel auf einen Windows-PC oder über iCloud für Windows, bleiben sie im HEIC-Format.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Tipps für Bilder auf Ihrer Webseite',
        bullets: [
          'Erst verkleinern, dann umwandeln: Ein 4000 Pixel breites Foto, das mit 1200 Pixeln angezeigt wird, verschwendet Bandbreite. Nutzen Sie die Option „Größe ändern“.',
          'Eine Qualität von 80–85 % ist für Fotos auf Webseiten ein guter Kompromiss.',
          'Behalten Sie das Original, wenn Sie das Bild auch für Druck oder E-Mail brauchen.',
          'WordPress, Shopify, Wix und Jimdo akzeptieren WebP-Uploads.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Gut zu wissen',
        paragraphs: [
          `Eine Umwandlung kann keine Details zurückholen, die im ${c.F}-Bild nicht mehr vorhanden sind. Bewahren Sie deshalb immer die Originaldatei auf und wandeln Sie bei Bedarf von dort aus erneut um.`,
          `Alle Umwandlungen laufen lokal in Ihrem Browser – auch auf dem Handy. Bei vielen großen Dateien kann das ältere Geräte etwas länger beschäftigen; teilen Sie die Bilder dann in kleinere Gruppen auf.`,
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Beliebte Umwandlungen',
      paragraphs: [
        'Für jede gängige Umwandlung gibt es auch eine eigene Seite mit passenden Tipps: HEIC in JPG für iPhone-Fotos, WebP in JPG für Bilder aus dem Internet, JPG in WebP für schnellere Webseiten, PNG in JPG für kleinere Dateien und SVG in PNG für Logos. Sie finden sie unten unter „Weitere kostenlose Tools“.',
      ],
    },
  ],
};

export default de;
