import type { ToolPageContent } from '../toolPage';

// Natively written for Dutch searchers (Netherlands and Flanders). Target phrases:
// "locatie toevoegen aan foto", "GPS-gegevens toevoegen aan foto", "foto's geotaggen",
// "locatie aan foto koppelen", "EXIF-gegevens bewerken", "Google Bedrijfsprofiel foto's".
const nl: ToolPageContent = {
  metaTitle: "Locatie toevoegen aan foto: gratis GPS-geotag online",
  metaDescription:
    "Voeg gratis een locatie toe aan je foto's: GPS-coördinaten, titel en bedrijfsgegevens in JPG, PNG, WebP en HEIC. Geen account, geen watermerk.",

  eyebrow: 'Gratis · Geen account · Geen watermerk',
  h1: "Locatie toevoegen aan foto's: gratis GPS-gegevens toevoegen",
  subtitle:
    "Kies een plek op de kaart, vul je bedrijfsgegevens in en download je foto's met de GPS-coördinaten in de EXIF-gegevens. Werkt met JPG, PNG, WebP, HEIC en meer, tot 10 foto's tegelijk.",
  trustChips: ['100% gratis', "Tot 10 foto's tegelijk", "Foto's worden niet bewaard", 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: "Foto's geotaggen",
  ctaSecondary: 'Zo werkt het',

  stepsTitle: 'GPS-gegevens aan een foto toevoegen in 4 stappen',
  stepsIntro: 'Je hebt geen Lightroom, ExifTool of app nodig. Alles gebeurt op deze pagina.',
  steps: [
    { title: "Upload je foto's", desc: "Sleep tot 10 afbeeldingen naar het vak of plak de URL van een webpagina om de afbeeldingen daarvan te importeren. Bestaande EXIF-gegevens zie je meteen." },
    { title: 'Kies de locatie', desc: 'Zoek op adres, bedrijfsnaam of bezienswaardigheid, versleep de markering op de kaart of typ de breedte- en lengtegraad in.' },
    { title: 'Vul je bedrijfsgegevens in', desc: 'Voeg titel, omschrijving, trefwoorden en bedrijfsnaam toe. Straat, plaats en postcode worden automatisch ingevuld vanaf de kaart.' },
    { title: 'Toepassen en downloaden', desc: 'Kies het formaat en de compressie, klik op toepassen en download elke foto los of alles samen als ZIP.' },
  ],

  featuresTitle: "Alles wat je nodig hebt om foto's te geotaggen",
  featuresIntro: "Gemaakt voor ondernemers, vakmensen, SEO-bureaus en fotografen die snel een locatie aan hun afbeeldingen willen koppelen.",
  features: [
    { title: 'Zoeken op de kaart', desc: 'Vind elke straat, plaats of elk bedrijf en zet de markering precies op het juiste gebouw.' },
    { title: 'Exacte coördinaten', desc: 'Typ de breedte- en lengtegraad zelf in als je de locatie al weet.' },
    { title: "Meerdere foto's tegelijk", desc: "Geef tot 10 foto's dezelfde locatie of pas de metadata van één afbeelding apart aan." },
    { title: 'Metadata voor lokale SEO', desc: 'Zet titel, omschrijving, trefwoorden en bedrijfsnaam in EXIF-velden die Windows en de meeste fotoprogramma’s tonen.' },
    { title: 'Omzetten en comprimeren', desc: 'Exporteer als JPG, PNG, WebP, AVIF of TIFF en maak bestanden kleiner voor een snellere website.' },
    { title: 'Importeren via URL', desc: 'Haal afbeeldingen op van een openbare webpagina of een directe link zonder ze eerst te downloaden.' },
    { title: 'Bijsnijden en bewerken', desc: 'Snijd bij op een vaste verhouding of vrij voordat je de locatie toevoegt.' },
  ],

  metadataTitle: 'Welke EXIF-gegevens de tool in je foto zet',
  metadataIntro: 'Geotaggen betekent dat de locatie in het bestand zelf wordt opgeslagen, in de EXIF-metadata. Dit schrijft PinPixl precies weg:',
  metadataHeaders: ['Gegeven', 'EXIF-veld', 'Voorbeeld'],
  metadataRows: [
    { field: 'GPS-locatie', example: '52.0907° N, 5.1214° O' },
    { field: 'Titel', example: 'Vers desembrood uit onze bakkerij in Utrecht' },
    { field: 'Omschrijving', example: 'De ochtendbaksels in onze winkel aan de Oudegracht.' },
    { field: 'Trefwoorden', example: 'bakkerij, desembrood, Utrecht' },
    { field: 'Bedrijfsnaam', example: 'Jouw bedrijfsnaam' },
    { field: 'Plaats, land en meer', example: 'City: Utrecht; Country: Nederland' },
    { field: 'Opnamedatum, camera', example: '2026:11:18 07:30:00' },
  ],
  metadataNote: 'JPG geeft de betrouwbaarste resultaten. Andere formaten worden omgezet; of alle velden behouden blijven, hangt af van het platform waar je de afbeelding uploadt.',

  useCasesTitle: "Wie heeft er iets aan foto's geotaggen?",
  useCases: [
    { title: 'Ondernemers met een Google Bedrijfsprofiel', desc: "Bereid foto's van je zaak, team en werk voor met consistente locatiegegevens voordat je ze plaatst." },
    { title: 'SEO- en marketingbureaus', desc: "Geotag klantfoto's in één keer met de juiste naam, trefwoorden en het adres per vestiging." },
    { title: 'Makelaars', desc: 'Leg vast waar elke woningfoto is gemaakt, zodat advertenties en archieven overzichtelijk blijven.' },
    { title: 'Aannemers en vakmensen', desc: "Laat zien waar een klus is uitgevoerd: voor- en nafoto's dragen de locatie van het project." },
    { title: 'Fotografen en reizigers', desc: "Geef foto's van camera's zonder GPS een locatie, zodat ze op de kaart verschijnen in Google Foto's, Apple Foto's of Lightroom." },
    { title: 'Website-eigenaren', desc: 'Comprimeer en zet afbeeldingen om voor snellere pagina’s zonder nuttige metadata te verliezen.' },
  ],

  seoTitle: "Helpt geotaggen van foto's voor lokale SEO? Het eerlijke antwoord",
  seoParagraphs: [
    'Geotaggen wordt vaak verkocht als rankingtruc. Dat is het niet. Google heeft nooit bevestigd dat GPS-gegevens in een afbeelding meetellen voor de ranking, en bij foto’s op een Google Bedrijfsprofiel worden de EXIF-gegevens bij publicatie verwijderd.',
    'Waarom dan toch? Omdat locatiegegevens je fotoarchief op orde houden, fotoapps en kaarten je afbeeldingen correct plaatsen en bestanden op je eigen website en in bedrijvengidsen een extra consistent locatiegegeven krijgen. Zie het als goed onderhoud dat je lokale SEO ondersteunt, niet als vervanging.',
    'Wat aantoonbaar telt voor lokaal zoeken, is wat mensen en Google zien: echte foto’s van je bedrijf, duidelijke bestandsnamen, nuttige alt-teksten en overal dezelfde naam, hetzelfde adres en telefoonnummer.',
  ],
  seoChecklistTitle: 'Checklist voor afbeeldingen en lokale SEO',
  seoChecklist: [
    "Gebruik echte foto's van je pand, team en werk in plaats van stockfoto's.",
    'Geef bestanden een beschrijvende naam, bijvoorbeeld bakkerij-utrecht-desembrood.jpg in plaats van IMG_4521.jpg.',
    'Schrijf alt-teksten die beschrijven wat er te zien is, geen rij trefwoorden.',
    'Comprimeer afbeeldingen zodat de pagina snel laadt op mobiel.',
    "Plaats regelmatig nieuwe foto's op je Google Bedrijfsprofiel.",
    'Houd naam, adres en telefoonnummer overal exact hetzelfde.',
  ],

  privacyTitle: "Wat we met je foto's doen",
  privacyParagraphs: [
    "Om metadata te schrijven en formaten om te zetten, wordt je foto via een versleutelde verbinding naar onze server gestuurd, in het geheugen verwerkt en als download teruggegeven. We bewaren geen foto's, houden geen kopieën en gebruiken ze nergens anders voor.",
    "Er is geen account, dus niets koppelt je foto's aan jou. Het zoeken naar locaties gebruikt openbare kaartgegevens.",
  ],

  formatsTitle: 'Ondersteunde afbeeldingsformaten',
  formats: [
    { format: 'JPG / JPEG', support: 'Volledig', note: 'De beste keuze. GPS en alle tekstvelden werken overal.' },
    { format: 'PNG', support: 'Goed', note: 'GPS wordt opgeslagen, maar sommige sites en apps negeren PNG-metadata.' },
    { format: 'WebP', support: 'Goed', note: 'Kleine bestanden voor websites. Of metadata wordt gelezen, verschilt per platform.' },
    { format: 'HEIC / HEIF', support: 'Omgezet', note: "iPhone-foto's. Exporteer als JPG voor de beste compatibiliteit." },
    { format: 'AVIF, TIFF', support: 'Omgezet', note: 'Worden geaccepteerd en geëxporteerd. Controleer of je platform de metadata leest.' },
  ],

  faqTitle: "Veelgestelde vragen over foto's geotaggen",
  faqSubtitle: 'Antwoorden op veelgestelde vragen over GPS, EXIF en metadata in afbeeldingen.',
  faqs: [
    { q: 'Hoe voeg ik een locatie toe aan een foto?', a: 'Upload de foto hierboven, zoek het adres of versleep de markering op de kaart en klik op toepassen. De tool zet de coördinaten in de EXIF-gegevens en je downloadt de gegeotagde foto. Dat duurt minder dan een minuut en je hoeft niets te installeren.' },
    { q: 'Is de tool echt gratis?', a: "Ja. Geen account, geen watermerk en geen betaald abonnement. Je kunt tot 10 foto's per keer verwerken, van maximaal 10 MB per stuk." },
    { q: "Verbeteren gegeotagde foto's mijn positie in Google?", a: "Niet direct. Google heeft GPS-gegevens in afbeeldingen nooit als rankingfactor bevestigd, en het Google Bedrijfsprofiel verwijdert EXIF-gegevens uit geplaatste foto's. Het helpt bij ordenen en consistente gegevens, maar echte foto's, goede bestandsnamen en alt-teksten wegen zwaarder." },
    { q: "Moet ik foto's geotaggen voordat ik ze op mijn Google Bedrijfsprofiel zet?", a: "Het kan geen kwaad en houdt je originele bestanden overzichtelijk, maar verwacht er op zichzelf geen betere positie van. Belangrijker is regelmatig echte, recente en goede foto's plaatsen." },
    { q: 'Hoe bewerk ik EXIF-gegevens van een foto online?', a: 'Met PinPixl pas je GPS-locatie, titel, omschrijving, trefwoorden, bedrijfsnaam, datum en camera aan via het formulier en download je het bestand met de nieuwe EXIF-gegevens, zonder software te installeren.' },
    { q: "Bewaren jullie mijn foto's?", a: "Nee. Foto's worden alleen in het geheugen van onze server verwerkt om metadata te schrijven en het formaat om te zetten, en daarna aan je teruggegeven. Ze worden niet opgeslagen of gedeeld." },
    { q: 'Hoe zie ik of een foto GPS-gegevens bevat?', a: 'Upload hem in de tool en de metadata verschijnt meteen. Op Windows: klik met rechts op het bestand, kies Eigenschappen en dan Details. Op een Mac: open hem in Voorvertoning en kies Extra › Toon infovenster.' },
    { q: "Kan ik HEIC-foto's van mijn iPhone geotaggen?", a: 'Ja, HEIC- en HEIF-bestanden worden ondersteund. Exporteer ze als JPG voor de beste compatibiliteit.' },
    { q: "Kan ik meerdere foto's tegelijk geotaggen?", a: "Ja. Upload tot 10 foto's, kies één locatie, pas die op alle foto's toe en download ze samen als ZIP. Je kunt elke foto nog steeds apart aanpassen." },
    { q: 'Gaat de kwaliteit van mijn foto achteruit?', a: 'Nee, tenzij je compressie of een ander formaat kiest. Met compressie op Geen en het originele formaat verandert alleen de metadata.' },
  ],

  finalCtaTitle: "Klaar om je foto's te geotaggen?",
  finalCtaText: 'Gratis, zonder account en binnen een minuut klaar.',
  finalCtaButton: 'Nu beginnen',
};

export default nl;
