import type { ToolExtras } from '../types';

// Dutch long-form sections (Netherlands and Flanders), written natively.
const nl: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'Wat zijn EXIF-gegevens eigenlijk?',
        paragraphs: [
          'EXIF staat voor “Exchangeable Image File Format”. Elke keer dat je een foto maakt, zet je camera of telefoon onzichtbare extra info in het bestand: het toestel, de lens, het diafragma, de sluitertijd, ISO, datum en tijd – en als locatievoorzieningen aanstaan ook de precieze GPS-coördinaten.',
          'Vaak komen daar nog XMP- en IPTC-gegevens bij uit Lightroom, Photoshop of andere programma’s: titel, onderschrift, trefwoorden, maker en copyright. De viewer laat je dat allemaal in één keer zien, veel meer dan de paar velden die Windows onder “Eigenschappen” toont.',
        ],
      },
      {
        title: 'Waarom sommige foto’s geen metadata hebben',
        paragraphs: [
          'Zet je een foto op WhatsApp, Facebook, Instagram of X, dan wordt de metadata bijna altijd verwijderd, voor je privacy en om ruimte te besparen. Een afbeelding die je uit een chat opslaat, heeft daardoor meestal geen camera- of locatiegegevens meer.',
          'Ook screenshots, gescande documenten en veel bewerkte afbeeldingen bevatten nauwelijks EXIF. Wil je weten wat er echt in een foto zit, gebruik dan altijd het originele bestand van je telefoon of camera.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Hoe nauwkeurig is de locatie van een foto?',
        paragraphs: [
          'De tool leest de GPS-coördinaten die je telefoon bij het maken van de foto heeft opgeslagen; hij raadt de plek niet aan de hand van wat er op de foto staat. Buiten ligt het opgeslagen punt meestal 5 tot 20 meter naast de echte plek.',
          'Binnen, in smalle straten met hoge gebouwen of vlak nadat je je telefoon hebt aangezet, kan de afwijking groter zijn omdat het GPS-signaal zwak is of weerkaatst. Met de satellietweergave zie je snel of het punt klopt.',
        ],
      },
      {
        title: 'Bescherm je eigen locatie',
        paragraphs: [
          'Wat handig is om de plek van andermans foto te vinden, werkt ook andersom: wie een originele foto van jou krijgt via e-mail, een cloudlink of AirDrop, kan soms precies zien waar je woont of op welke school je kinderen zitten.',
          'Haal de locatie weg met onze tool ‘EXIF-gegevens verwijderen’ voordat je iets op Marktplaats zet of foto’s van je huis deelt. Dat kost maar een paar seconden.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Zonder verlies: de afbeelding blijft precies hetzelfde',
        paragraphs: [
          'Veel online tools slaan de hele afbeelding opnieuw op, waardoor de kwaliteit telkens een beetje achteruitgaat. Bij JPG, PNG en WebP knippen wij alleen de metadatablokken uit het bestand; de beeldgegevens blijven exact gelijk.',
          'Twee uitzonderingen: foto’s die alleen dankzij de oriëntatietag rechtop staan, slaan we rechtop opnieuw op (anders zouden ze op hun kant liggen), en HEIC-foto’s van de iPhone worden als JPG opgeslagen, omdat browsers geen HEIC kunnen schrijven.',
        ],
      },
      {
        title: 'Wat er precies wordt verwijderd',
        bullets: [
          'EXIF: GPS-locatie, cameramodel, lens, opname-instellingen, datums, software, serienummers en miniatuur.',
          'XMP: bewerkingsgeschiedenis, beoordelingen, trefwoorden en locatiegegevens uit programma’s zoals Lightroom.',
          'IPTC: onderschrift, maker, copyright en contactgegevens.',
          'Opmerkingen en tekstblokken in PNG-bestanden.',
          'Het kleurprofiel (ICC) blijft staan, zodat de kleuren hetzelfde blijven.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Breedtegraad en lengtegraad, simpel uitgelegd',
        paragraphs: [
          'De breedtegraad geeft aan hoe ver een plek ten noorden of zuiden van de evenaar ligt (van −90° tot +90°). De lengtegraad geeft aan hoe ver hij ten oosten of westen van de nulmeridiaan van Greenwich ligt (van −180° tot +180°). Samen vormen ze de coördinaten van een punt.',
          'Je schrijft ze op twee manieren: in decimale graden, zoals 52.370216, 4.895168 – het formaat van Google Maps en de meeste apps – of in graden, minuten en seconden, zoals 52°22\'12.8" N 4°53\'42.6" E, bekend van wandelkaarten en de scheepvaart.',
        ],
      },
      {
        title: 'Waarvoor gebruik je coördinaten?',
        bullets: [
          'De exacte locatie invullen in je Google Bedrijfsprofiel, bedrijvengidsen of bezorgapps.',
          'Klanten of vakmensen een ontmoetingspunt of bouwplaats zonder huisnummer sturen.',
          'Foto’s geotaggen: kopieer de coördinaten en plak ze in onze geotag-tool.',
          'Controleren waar een locatie ligt die iemand je via WhatsApp stuurde.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Waarom afbeeldingen verkleinen?',
        bullets: [
          'Afbeeldingen zijn meestal het zwaarste deel van een webpagina. Kleinere bestanden laden sneller en verbeteren je Core Web Vitals.',
          'Veel e-maildiensten en formulieren hebben een maximale bestandsgrootte.',
          'Webshops, advertentiesites en je Google Bedrijfsprofiel verwerken kleine afbeeldingen sneller.',
          'Je bespaart opslagruimte en je bezoekers mobiele data.',
        ],
      },
      {
        title: 'Zo werkt PNG-compressie',
        paragraphs: [
          'PNG is verliesvrij, dus een browser kan het nauwelijks kleiner maken. Blijft je bestand PNG, dan brengt onze server het terug tot een geoptimaliseerd kleurenpalet – dezelfde techniek als bekende PNG-compressors. Dat scheelt vaak 60 tot 80% met nauwelijks zichtbaar verschil.',
          'Het bestand wordt alleen in het geheugen verwerkt en niet bewaard. Wil je dat er niets van je apparaat af gaat, kies dan WebP als uitvoer: dat gebeurt volledig in de browser en is meestal nog kleiner.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'Zo slaat je iPhone foto’s meteen als JPG op',
        paragraphs: [
          'Wil je liever meteen JPG-foto’s, ga dan op je iPhone naar Instellingen › Camera › Formaten en kies ‘Meest compatibel’. Nieuwe foto’s worden dan als JPG opgeslagen; bestaande blijven HEIC, en daarvoor is deze converter.',
          'Goed om te weten: als je via AirDrop of e-mail deelt, zet iOS foto’s vaak automatisch om naar JPG. Kopieer je ze met een kabel naar een Windows-pc of via iCloud voor Windows, dan blijven ze HEIC.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Tips voor afbeeldingen op je website',
        bullets: [
          'Eerst verkleinen, dan omzetten: een foto van 4000 pixels die op 1200 wordt getoond, verspilt bandbreedte. Gebruik de optie ‘Formaat wijzigen’.',
          'Een kwaliteit van 80–85% is een goede balans voor foto’s op het web.',
          'Bewaar het origineel als je de afbeelding ook voor print of e-mail nodig hebt.',
          'WordPress, Shopify, Wix en Lightspeed accepteren WebP.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Goed om te weten',
        paragraphs: [
          `Omzetten haalt geen details terug die niet meer in de ${c.F}-afbeelding zitten. Bewaar dus altijd het originele bestand en zet vanuit dat bestand opnieuw om als dat nodig is.`,
          'Alle conversies gebeuren in je browser, ook op je telefoon. Met veel grote bestanden kan een ouder toestel er even over doen; zet ze dan in kleinere groepjes om.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Populaire conversies',
      paragraphs: [
        'Elke veelgebruikte conversie heeft een eigen pagina met tips: HEIC naar JPG voor iPhone-foto’s, WebP naar JPG voor afbeeldingen van internet, JPG naar WebP voor een snellere website, PNG naar JPG voor kleinere bestanden en SVG naar PNG voor logo’s. Je vindt ze hieronder bij ‘Meer gratis tools’.',
      ],
    },
  ],
};

export default nl;
