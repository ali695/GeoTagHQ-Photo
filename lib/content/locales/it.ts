import type { ToolPageContent } from '../toolPage';

// Natively written for Italian searchers. Target phrases:
// "aggiungere posizione GPS alle foto", "geotaggare foto", "geolocalizzare foto online",
// "inserire coordinate GPS in una foto", "modificare dati EXIF", "Profilo dell'attività su Google".
const it: ToolPageContent = {
  metaTitle: 'Aggiungere posizione GPS alle foto: geotag gratis online',
  metaDescription:
    'Aggiungi la posizione GPS alle foto gratis: coordinate, titolo e dati aziendali in JPG, PNG, WebP e HEIC. Senza registrazione e senza filigrana.',

  eyebrow: 'Gratis · Senza registrazione · Senza filigrana',
  h1: 'Aggiungere la posizione GPS alle foto: geotag gratis online',
  subtitle:
    "Scegli un punto sulla mappa, inserisci i dati della tua attività e scarica le foto con le coordinate GPS scritte nei dati EXIF. Funziona con JPG, PNG, WebP, HEIC e altri formati, fino a 10 foto alla volta.",
  trustChips: ['100% gratis', 'Fino a 10 foto alla volta', 'Le foto non vengono salvate', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Geotagga le tue foto',
  ctaSecondary: 'Come funziona',

  stepsTitle: 'Come inserire le coordinate GPS in una foto in 4 passaggi',
  stepsIntro: 'Non servono Lightroom, ExifTool o app da installare. Fai tutto da questa pagina.',
  steps: [
    { title: 'Carica le foto', desc: "Trascina fino a 10 immagini oppure incolla l'URL di una pagina web per importarne le immagini. I dati EXIF già presenti compaiono subito." },
    { title: 'Scegli la posizione', desc: "Cerca un indirizzo, il nome di un'attività o un luogo noto, sposta il segnaposto sulla mappa o inserisci latitudine e longitudine." },
    { title: "Aggiungi i dati dell'attività", desc: "Inserisci titolo, descrizione, parole chiave e nome dell'attività. Indirizzo, città e CAP si compilano da soli dalla mappa." },
    { title: 'Applica e scarica', desc: 'Scegli formato e compressione, clicca su applica e scarica ogni foto oppure tutte insieme in un file ZIP.' },
  ],

  featuresTitle: 'Tutto ciò che serve per geolocalizzare le foto',
  featuresIntro: 'Pensato per titolari di attività, agenzie SEO, agenti immobiliari e fotografi che devono aggiungere la posizione alle immagini in poco tempo.',
  features: [
    { title: 'Ricerca sulla mappa', desc: "Trova qualsiasi via, città, luogo o attività e regola il punto esatto trascinando il segnaposto." },
    { title: 'Coordinate precise', desc: 'Inserisci a mano latitudine e longitudine quando conosci già la posizione esatta.' },
    { title: 'Più foto insieme', desc: "Geotagga fino a 10 foto con la stessa posizione o modifica i metadati di una sola immagine." },
    { title: 'Metadati per la SEO locale', desc: "Scrivi titolo, descrizione, parole chiave e nome dell'attività in campi EXIF visibili su Windows e nei principali programmi." },
    { title: 'Converti e comprimi', desc: 'Esporta in JPG, PNG, WebP, AVIF o TIFF e riduci il peso per un sito più veloce.' },
    { title: 'Importa da URL', desc: 'Prendi le immagini da una pagina pubblica o da un link diretto senza scaricarle prima.' },
    { title: 'Ritaglia e modifica', desc: 'Ritaglia con un formato fisso o libero prima di aggiungere la posizione.' },
  ],

  metadataTitle: 'Quali dati EXIF vengono scritti nella foto',
  metadataIntro: 'Geotaggare una foto significa salvare la posizione dentro il file stesso, nei metadati EXIF. Ecco esattamente cosa scrive PinPixl:',
  metadataHeaders: ['Dato', 'Campo EXIF', 'Esempio'],
  metadataRows: [
    { field: 'Posizione GPS', example: '44.4949° N, 11.3426° E' },
    { field: 'Titolo', example: 'Tortellini fatti a mano nel nostro laboratorio a Bologna' },
    { field: 'Descrizione', example: 'La sfoglia del mattino nella nostra bottega in centro.' },
    { field: 'Parole chiave', example: 'pasta fresca, tortellini, Bologna' },
    { field: "Nome dell'attività", example: 'Il nome della tua attività' },
    { field: 'Città, paese e altro', example: 'City: Bologna; Country: Italia' },
    { field: 'Data dello scatto, fotocamera', example: '2026:11:18 08:00:00' },
  ],
  metadataNote: "Il JPG offre i risultati più affidabili. Gli altri formati vengono convertiti e la lettura di alcuni campi dipende dalla piattaforma su cui carichi l'immagine.",

  useCasesTitle: 'Chi ha bisogno di geotaggare le foto?',
  useCases: [
    { title: "Attività con Profilo dell'attività su Google", desc: 'Prepara le foto di locale, staff e lavori con dati di posizione coerenti prima di pubblicarle.' },
    { title: 'Agenzie SEO e di marketing', desc: 'Geotagga in blocco le foto dei clienti con nome, parole chiave e indirizzo corretti per ogni sede.' },
    { title: 'Agenti immobiliari', desc: 'Annota dove è stata scattata ogni foto di un immobile per tenere in ordine annunci e archivi.' },
    { title: 'Artigiani e imprese edili', desc: 'Dimostra dove hai svolto un lavoro: le foto prima e dopo riportano la posizione del cantiere.' },
    { title: 'Fotografi e viaggiatori', desc: 'Aggiungi la posizione alle foto di fotocamere senza GPS per vederle sulla mappa in Google Foto, Apple Foto o Lightroom.' },
    { title: 'Gestori di siti web', desc: 'Comprimi e converti le immagini per pagine più veloci senza perdere metadati utili.' },
  ],

  seoTitle: 'Geotaggare le foto aiuta la SEO locale? La risposta onesta',
  seoParagraphs: [
    "Il geotag viene spesso presentato come un trucco per posizionarsi. Non lo è. Google non ha mai confermato che i dati GPS di un'immagine siano un fattore di ranking, e le foto pubblicate sul Profilo dell'attività su Google perdono i dati EXIF.",
    "E allora perché farlo? Perché la posizione tiene in ordine l'archivio fotografico, aiuta app e mappe a collocare correttamente le immagini e aggiunge un dato di luogo coerente ai file che pubblichi sul tuo sito e nelle directory. È una buona abitudine a supporto della SEO locale, non un sostituto.",
    "Quello che conta davvero nella ricerca locale è ciò che vedono persone e Google: foto reali della tua attività, nomi file descrittivi, un testo alternativo utile e nome, indirizzo e telefono identici ovunque.",
  ],
  seoChecklistTitle: 'Checklist SEO locale per le immagini',
  seoChecklist: [
    'Usa foto reali di locale, staff e lavori. Evita le foto stock.',
    'Dai ai file nomi descrittivi, ad esempio pasta-fresca-bologna.jpg invece di IMG_4521.jpg.',
    "Scrivi un testo alternativo che descriva l'immagine, non un elenco di parole chiave.",
    'Comprimi le immagini perché la pagina si carichi in fretta da smartphone.',
    "Pubblica regolarmente nuove foto sul Profilo dell'attività su Google.",
    'Mantieni nome, indirizzo e telefono identici sul sito e in tutte le directory.',
  ],

  privacyTitle: 'Cosa facciamo con le tue foto',
  privacyParagraphs: [
    "Per scrivere i metadati e convertire i formati, la foto viene inviata tramite una connessione cifrata al nostro server, elaborata in memoria e restituita come download. Non salviamo le foto, non ne conserviamo copie e non le usiamo per altro.",
    'Non esistono account, quindi nulla collega le foto a te. La ricerca delle posizioni usa dati cartografici pubblici.',
  ],

  formatsTitle: 'Formati immagine supportati',
  formats: [
    { format: 'JPG / JPEG', support: 'Completo', note: 'La scelta migliore. GPS e tutti i campi di testo funzionano ovunque.' },
    { format: 'PNG', support: 'Buono', note: 'Il GPS viene scritto, ma alcuni siti e app ignorano i metadati PNG.' },
    { format: 'WebP', support: 'Buono', note: 'File leggeri per il web. La lettura dei metadati varia in base alla piattaforma.' },
    { format: 'HEIC / HEIF', support: 'Convertito', note: 'Foto da iPhone. Esportale in JPG per la massima compatibilità.' },
    { format: 'AVIF, TIFF', support: 'Convertito', note: 'Accettati ed esportati. Verifica che la tua piattaforma legga i metadati.' },
  ],

  faqTitle: 'Domande frequenti sul geotag delle foto',
  faqSubtitle: 'Risposte alle domande più comuni su GPS, dati EXIF e metadati delle immagini.',
  faqs: [
    { q: 'Come si aggiunge la posizione GPS a una foto?', a: 'Carica la foto qui sopra, cerca l’indirizzo o sposta il segnaposto sulla mappa e clicca su applica. Lo strumento scrive le coordinate nei dati EXIF e scarichi la foto geotaggata. Ci vuole meno di un minuto, senza installare nulla.' },
    { q: 'Lo strumento è davvero gratis?', a: 'Sì. Niente registrazione, niente filigrana e nessun piano a pagamento. Puoi elaborare fino a 10 foto per volta, da massimo 10 MB ciascuna.' },
    { q: 'Geotaggare le foto migliora il posizionamento su Google?', a: "Non direttamente. Google non ha confermato i dati GPS delle immagini come fattore di ranking, e il Profilo dell'attività su Google rimuove i dati EXIF dalle foto pubblicate. Serve per ordinare le immagini e mantenere dati coerenti, ma contano di più foto reali, buoni nomi file e testo alternativo." },
    { q: "Conviene geotaggare le foto prima di caricarle sul Profilo dell'attività su Google?", a: 'Non fa male e tiene in ordine i file originali, ma non aspettarti un miglioramento del ranking solo per questo. Concentrati sul pubblicare spesso foto reali, recenti e di qualità.' },
    { q: 'Come si modificano i dati EXIF di una foto online?', a: "Con PinPixl modifichi posizione GPS, titolo, descrizione, parole chiave, nome dell'attività, data e fotocamera dal modulo e scarichi il file con i nuovi dati EXIF, senza installare programmi." },
    { q: 'Le mie foto vengono salvate?', a: 'No. Le foto vengono elaborate nella memoria del nostro server solo per scrivere i metadati e convertire il formato, poi ti vengono restituite. Non vengono salvate né condivise.' },
    { q: 'Come capisco se una foto ha già la posizione GPS?', a: "Caricala nello strumento e i metadati compaiono subito. Su Windows: clic destro sul file, Proprietà, poi Dettagli. Su Mac: aprila in Anteprima e scegli Strumenti › Mostra impostazioni." },
    { q: 'Posso geotaggare le foto HEIC di iPhone?', a: 'Sì, i file HEIC e HEIF sono accettati. Per la massima compatibilità esportali in JPG.' },
    { q: 'Posso geotaggare più foto insieme?', a: 'Sì. Carica fino a 10 foto, scegli una posizione, applicala a tutte e scaricale insieme in un file ZIP. Puoi comunque modificare ogni foto singolarmente.' },
    { q: 'La foto perde qualità?', a: 'No, a meno che tu non scelga una compressione o un altro formato. Con compressione su Nessuna e formato originale cambiano solo i metadati.' },
  ],

  finalCtaTitle: 'Pronto ad aggiungere la posizione alle tue foto?',
  finalCtaText: 'Gratis, senza registrazione e in meno di un minuto.',
  finalCtaButton: 'Inizia ora',
};

export default it;
