import type { ToolExtras } from '../types';

// Brazilian Portuguese long-form sections, written natively.
const pt: ToolExtras = {
  sections: {
    'exif-viewer': [
      {
        title: 'O que são dados EXIF?',
        paragraphs: [
          'EXIF vem de “Exchangeable Image File Format”. Toda vez que você tira uma foto, a câmera ou o celular grava dentro do arquivo informações que não aparecem na imagem: modelo do aparelho, lente, abertura, velocidade, ISO, data e hora — e, se a localização estiver ligada, as coordenadas GPS exatas.',
          'Muitas vezes também há dados XMP e IPTC deixados pelo Lightroom, Photoshop e outros programas: título, legenda, palavras-chave, autor e direitos autorais. O visualizador mostra tudo de uma vez, bem mais do que os poucos campos que o Windows exibe em “Propriedades”.',
        ],
      },
      {
        title: 'Por que algumas fotos não têm metadados',
        paragraphs: [
          'Quando você posta uma foto no WhatsApp, Facebook, Instagram ou X, os metadados quase sempre são apagados, por privacidade e para economizar espaço. Por isso, uma imagem salva de uma conversa geralmente já não tem dados da câmera nem localização.',
          'Prints, documentos digitalizados e muitas imagens editadas também quase não têm EXIF. Para saber o que uma foto guarda de verdade, use sempre o arquivo original do celular ou da câmera.',
        ],
      },
    ],
    'photo-location-finder': [
      {
        title: 'Qual a precisão da localização da foto?',
        paragraphs: [
          'A ferramenta lê as coordenadas GPS que o celular gravou na hora da foto; ela não tenta adivinhar o lugar pelo que aparece na imagem. Ao ar livre, o ponto gravado costuma ficar a uns 5 a 20 metros do local real.',
          'Em ambientes fechados, em ruas com prédios altos ou logo depois de ligar o celular, o erro pode ser maior, porque o sinal de GPS fica fraco ou rebate. Com a vista de satélite dá para conferir rapidinho se o ponto faz sentido.',
        ],
      },
      {
        title: 'Proteja a sua própria localização',
        paragraphs: [
          'O que ajuda a descobrir onde uma foto foi tirada também pode expor você: quem recebe uma foto original sua por e-mail, link da nuvem ou AirDrop pode ver exatamente onde você mora ou em que escola seus filhos estudam.',
          'Antes de anunciar no OLX, Mercado Livre ou Enjoei, ou de postar fotos da sua casa, remova a localização com a nossa ferramenta “Remover dados EXIF”. Leva poucos segundos.',
        ],
      },
    ],
    'remove-exif': [
      {
        title: 'Sem perda: a imagem continua igualzinha',
        paragraphs: [
          'Muitas ferramentas online salvam a imagem inteira de novo, e ela perde um pouco de qualidade a cada vez. Em JPG, PNG e WebP, nós só recortamos os blocos de metadados do arquivo; os dados da imagem ficam idênticos.',
          'Duas exceções: fotos que dependem da tag de orientação são salvas já na posição certa (senão ficariam deitadas sem a tag), e fotos HEIC do iPhone são salvas como JPG, porque os navegadores não conseguem gravar HEIC.',
        ],
      },
      {
        title: 'O que é removido',
        bullets: [
          'EXIF: localização GPS, modelo da câmera, lente, configurações da foto, datas, software, números de série e miniatura.',
          'XMP: histórico de edição, classificações, palavras-chave e dados de local de programas como o Lightroom.',
          'IPTC: legenda, autor, direitos autorais e contato.',
          'Comentários e trechos de texto em arquivos PNG.',
          'Mantido: o perfil de cor (ICC), para as cores continuarem iguais.',
        ],
      },
    ],
    'lat-long-finder': [
      {
        title: 'Latitude e longitude sem complicação',
        paragraphs: [
          'A latitude mostra o quanto um lugar fica ao norte ou ao sul da linha do Equador (de −90° a +90°). A longitude mostra o quanto fica a leste ou a oeste do meridiano de Greenwich (de −180° a +180°). Juntas, elas formam as coordenadas geográficas de qualquer ponto.',
          'Existem dois jeitos comuns de escrever: em graus decimais, como -23.550520, -46.633308, que é o formato do Google Maps e da maioria dos apps, e em graus, minutos e segundos, como 23°33\'01.9" S 46°37\'59.9" W, comum em mapas impressos e na navegação.',
        ],
      },
      {
        title: 'Para que servem as coordenadas',
        bullets: [
          'Colocar o local exato no Perfil da Empresa no Google, em guias de empresas ou em apps de entrega.',
          'Mandar para clientes ou prestadores um ponto de encontro ou uma obra sem número.',
          'Colocar localização em fotos: copie as coordenadas e cole na nossa ferramenta de geotag.',
          'Conferir onde fica a localização que alguém mandou pelo WhatsApp.',
        ],
      },
    ],
    'image-compressor': [
      {
        title: 'Por que comprimir imagens?',
        bullets: [
          'As imagens costumam ser a parte mais pesada de um site. Arquivos menores carregam mais rápido e melhoram as Core Web Vitals.',
          'Muitos e-mails e formulários limitam o tamanho dos anexos.',
          'Lojas virtuais, sites de anúncios e o Perfil da Empresa no Google processam imagens leves mais rápido.',
          'Você economiza espaço e seus visitantes gastam menos dados móveis.',
        ],
      },
      {
        title: 'Como funciona a compressão de PNG',
        paragraphs: [
          'O PNG é sem perda, então o navegador quase não consegue diminuí-lo. Se você mantiver o formato PNG, nosso servidor reduz o arquivo para uma paleta de cores otimizada — a mesma técnica dos compressores de PNG mais conhecidos. Normalmente diminui de 60 a 80%, com diferença quase invisível.',
          'O arquivo é processado só em memória e não fica guardado. Se preferir que nada saia do seu aparelho, escolha WebP como formato de saída: tudo acontece no navegador e o arquivo costuma ficar ainda menor.',
        ],
      },
    ],
  },

  converter: (c) => {
    const out = [];
    if (c.from === 'heic') {
      out.push({
        title: 'Como fazer o iPhone salvar fotos em JPG',
        paragraphs: [
          'Se você prefere fotos em JPG desde o começo, vá em Ajustes › Câmera › Formatos e escolha “Mais Compatível”. As fotos novas serão salvas em JPG; as que você já tem continuam em HEIC, e é para isso que serve este conversor.',
          'Dica: ao compartilhar por AirDrop ou e-mail, o iOS muitas vezes já converte as fotos para JPG. Mas, se você passar as fotos por cabo para um PC com Windows ou pelo iCloud para Windows, elas continuam em HEIC.',
        ],
      });
    }
    if (c.to === 'webp') {
      out.push({
        title: 'Dicas para as imagens do seu site',
        bullets: [
          'Primeiro diminua, depois converta: uma foto de 4000 pixels exibida com 1200 desperdiça dados. Use a opção “Redimensionar”.',
          'Qualidade entre 80 e 85% é um bom equilíbrio para fotos na web.',
          'Guarde o original se também for usar a imagem para impressão ou e-mail.',
          'WordPress, Shopify, Wix e Nuvemshop aceitam imagens WebP.',
        ],
      });
    } else if (c.from !== 'heic') {
      out.push({
        title: 'Vale saber',
        paragraphs: [
          `Converter não recupera detalhes que a imagem ${c.F} já perdeu. Por isso, guarde sempre o arquivo original e converta de novo a partir dele quando precisar.`,
          'Todas as conversões acontecem no seu navegador, inclusive no celular. Com muitos arquivos grandes, aparelhos mais antigos podem demorar um pouco; nesse caso, converta em grupos menores.',
        ],
      });
    }
    return out;
  },

  imageConverter: [
    {
      title: 'Conversões mais procuradas',
      paragraphs: [
        'Cada conversão popular tem sua própria página com dicas: HEIC para JPG para fotos do iPhone, WebP para JPG para imagens baixadas da internet, JPG para WebP para deixar seu site mais rápido, PNG para JPG para arquivos menores e SVG para PNG para logos. Você encontra todas lá embaixo em “Mais ferramentas grátis”.',
      ],
    },
  ],
};

export default pt;
