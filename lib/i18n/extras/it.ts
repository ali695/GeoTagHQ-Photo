import type { ToolExtras } from '../types';

// Italian long-form sections, written natively.
const it: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'Cosa sono i dati EXIF?',
        paragraphs: [
          'EXIF sta per “Exchangeable Image File Format”. Ogni volta che scatti, la fotocamera o lo smartphone salva nel file informazioni che non si vedono: modello, obiettivo, diaframma, tempo di posa, ISO, data e ora — e, se la localizzazione è attiva, le coordinate GPS precise.',
          'Spesso ci sono anche dati XMP e IPTC lasciati da Lightroom, Photoshop o altri programmi: titolo, didascalia, parole chiave, autore e copyright. Il visualizzatore ti mostra tutto in un colpo d’occhio, molto più dei pochi campi che Windows mostra in “Proprietà”.',
        ],
      },
      {
        title: 'Perché alcune foto non hanno metadati',
        paragraphs: [
          'Quando pubblichi una foto su WhatsApp, Facebook, Instagram o X, i metadati vengono quasi sempre cancellati, per privacy e per risparmiare spazio. Per questo un’immagine salvata da una chat di solito non ha più né i dati della fotocamera né la posizione.',
          'Anche screenshot, documenti scansionati e molte immagini modificate hanno pochissimi dati EXIF. Se vuoi sapere cosa contiene davvero una foto, usa sempre il file originale del telefono o della fotocamera.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Quanto è precisa la posizione di una foto?',
        paragraphs: [
          'Lo strumento legge le coordinate GPS che il telefono ha salvato al momento dello scatto; non indovina il luogo da ciò che si vede nell’immagine. All’aperto il punto salvato è di solito a 5–20 metri dalla posizione reale.',
          'Al chiuso, nei vicoli tra palazzi alti o appena acceso il telefono, lo scarto può essere maggiore, perché il segnale GPS è debole o rimbalza. Con la vista satellite controlli in un attimo se il punto è credibile.',
        ],
      },
      {
        title: 'Proteggi la tua posizione',
        paragraphs: [
          'Quello che è utile per capire dove è stata scattata una foto altrui può ritorcersi contro di te: chi riceve una tua foto originale via email, link cloud o AirDrop può vedere esattamente dove abiti o la scuola dei tuoi figli.',
          'Prima di pubblicare un annuncio su Subito o Vinted, o di condividere foto di casa, rimuovi la posizione con il nostro strumento “Rimuovere dati EXIF”. Bastano pochi secondi.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Senza perdita: l’immagine resta identica',
        paragraphs: [
          'Molti strumenti online risalvano l’intera immagine, che perde un po’ di qualità ogni volta. Con JPG, PNG e WebP noi togliamo solo i blocchi di metadati dal file: i dati dell’immagine restano identici, byte per byte.',
          'Due eccezioni: le foto che si vedono dritte solo grazie al tag di orientamento vengono risalvate già raddrizzate (altrimenti apparirebbero di lato), e le foto HEIC dell’iPhone vengono salvate in JPG perché i browser non sanno scrivere l’HEIC.',
        ],
      },
      {
        title: 'Cosa viene rimosso',
        bullets: [
          'EXIF: posizione GPS, modello della fotocamera, obiettivo, impostazioni di scatto, date, software, numeri di serie e miniatura.',
          'XMP: cronologia delle modifiche, valutazioni, parole chiave e dati di luogo da programmi come Lightroom.',
          'IPTC: didascalia, autore, copyright e contatti.',
          'Commenti e blocchi di testo nei file PNG.',
          'Resta il profilo colore (ICC), così i colori non cambiano.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Latitudine e longitudine in parole semplici',
        paragraphs: [
          'La latitudine indica quanto un luogo è a nord o a sud dell’equatore (da −90° a +90°). La longitudine indica quanto è a est o a ovest del meridiano di Greenwich (da −180° a +180°). Insieme formano le coordinate geografiche di un punto.',
          'Si scrivono in due modi: in gradi decimali, come 45.464204, 9.189982, il formato di Google Maps e di quasi tutte le app, oppure in gradi, minuti e secondi, come 45°27\'51.1" N 9°11\'23.9" E, tipico delle carte e della nautica.',
        ],
      },
      {
        title: 'A cosa servono le coordinate',
        bullets: [
          'Inserire la posizione esatta nel Profilo dell’attività su Google, negli elenchi aziendali o nelle app di consegna.',
          'Mandare a clienti o artigiani un punto d’incontro o un cantiere senza numero civico.',
          'Geotaggare foto: copia le coordinate e incollale nel nostro strumento di geotag.',
          'Controllare dove si trova una posizione che ti hanno mandato su WhatsApp.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Perché comprimere le immagini?',
        bullets: [
          'Le immagini sono spesso la parte più pesante di una pagina. File più leggeri si caricano prima e migliorano i Core Web Vitals.',
          'Molte email e moduli online limitano la dimensione degli allegati.',
          'E-commerce, siti di annunci e il Profilo dell’attività su Google gestiscono più in fretta immagini leggere.',
          'Risparmi spazio e i tuoi visitatori consumano meno giga.',
        ],
      },
      {
        title: 'Come funziona la compressione PNG',
        paragraphs: [
          'Il PNG è senza perdita, quindi il browser quasi non riesce ad alleggerirlo. Se mantieni il formato PNG, il nostro server riduce l’immagine a una palette di colori ottimizzata, la stessa tecnica dei compressori PNG più noti. Di solito il peso cala del 60–80% con una differenza appena percettibile.',
          'Il file viene elaborato solo in memoria e non viene salvato. Se preferisci che nulla lasci il tuo dispositivo, scegli WebP come formato di uscita: avviene tutto nel browser e il file è spesso ancora più leggero.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'Come far salvare all’iPhone le foto in JPG',
        paragraphs: [
          'Se preferisci avere subito foto in JPG, vai su Impostazioni › Fotocamera › Formati e scegli “Più compatibile”. Le nuove foto verranno salvate in JPG; quelle che hai già restano HEIC, ed è qui che serve questo convertitore.',
          'Nota: condividendo via AirDrop o email, iOS spesso converte da solo le foto in JPG. Se invece le copi via cavo su un PC Windows o tramite iCloud per Windows, restano in HEIC.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Consigli per le immagini del tuo sito',
        bullets: [
          'Prima ridimensiona, poi converti: una foto da 4000 pixel mostrata a 1200 spreca banda. Usa l’opzione “Ridimensiona”.',
          'Una qualità dell’80–85% è un buon compromesso per le foto sul web.',
          'Tieni l’originale se ti serve l’immagine anche per la stampa o le email.',
          'WordPress, Shopify, Wix e PrestaShop accettano immagini WebP.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Buono a sapersi',
        paragraphs: [
          `La conversione non può recuperare dettagli che l’immagine ${c.F} non ha più. Conserva sempre il file originale e riparti da lì se devi convertire di nuovo.`,
          'Tutte le conversioni avvengono nel browser, anche da smartphone. Con tanti file grandi i dispositivi più vecchi possono metterci un po’: in quel caso convertili a piccoli gruppi.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Le conversioni più cercate',
      paragraphs: [
        'Ogni conversione popolare ha la sua pagina con consigli dedicati: HEIC in JPG per le foto dell’iPhone, WebP in JPG per le immagini scaricate da internet, JPG in WebP per un sito più veloce, PNG in JPG per file più leggeri e SVG in PNG per i loghi. Le trovi più in basso in “Altri strumenti gratuiti”.',
      ],
    },
  ],
};

export default it;
