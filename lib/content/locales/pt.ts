import type { ToolPageContent } from '../toolPage';

// Natively written for Brazilian Portuguese searchers (largest Portuguese market). Target phrases:
// "adicionar localização na foto", "colocar localização em foto", "inserir coordenadas GPS na foto",
// "geotag em fotos", "georreferenciar fotos", "editar dados EXIF", "Perfil da Empresa no Google".
const pt: ToolPageContent = {
  metaTitle: 'Adicionar localização na foto: geotag GPS grátis online',
  metaDescription:
    'Coloque localização nas fotos grátis: coordenadas GPS, título e dados da empresa em JPG, PNG, WebP e HEIC. Sem cadastro. Ideal para o Perfil da Empresa.',

  eyebrow: 'Grátis · Sem cadastro · Sem marca d’água',
  h1: 'Adicionar localização na foto: coloque coordenadas GPS de graça',
  subtitle:
    'Escolha um ponto no mapa, preencha os dados da sua empresa e baixe as fotos com as coordenadas GPS gravadas nos dados EXIF. Funciona com JPG, PNG, WebP, HEIC e mais, até 10 fotos de uma vez.',
  trustChips: ['100% grátis', 'Até 10 fotos de uma vez', 'Fotos não são armazenadas', 'JPG, PNG, WebP, HEIC'],
  ctaPrimary: 'Colocar localização nas fotos',
  ctaSecondary: 'Como funciona',

  stepsTitle: 'Como colocar localização em uma foto em 4 passos',
  stepsIntro: 'Você não precisa de Lightroom, ExifTool nem de aplicativo. Tudo acontece nesta página.',
  steps: [
    { title: 'Envie suas fotos', desc: 'Arraste até 10 imagens ou cole o link de uma página para importar as imagens dela. Os dados EXIF que já existem aparecem na hora.' },
    { title: 'Marque o local', desc: 'Pesquise um endereço, nome de empresa ou ponto de referência, arraste o marcador no mapa ou digite a latitude e a longitude.' },
    { title: 'Adicione os dados da empresa', desc: 'Preencha título, descrição, palavras-chave e nome da empresa. Endereço, cidade e CEP são preenchidos automaticamente pelo mapa.' },
    { title: 'Aplique e baixe', desc: 'Escolha o formato e a compressão, clique em aplicar e baixe cada foto ou todas juntas em um ZIP.' },
  ],

  featuresTitle: 'Tudo o que você precisa para georreferenciar fotos',
  featuresIntro: 'Feito para donos de negócio, agências de SEO, corretores de imóveis e fotógrafos que precisam colocar localização nas imagens rápido.',
  features: [
    { title: 'Busca no mapa', desc: 'Encontre qualquer rua, cidade, ponto de referência ou empresa e ajuste o local exato arrastando o marcador.' },
    { title: 'Coordenadas exatas', desc: 'Digite latitude e longitude manualmente quando você já sabe o local certo.' },
    { title: 'Várias fotos de uma vez', desc: 'Coloque a mesma localização em até 10 fotos ou altere os dados de uma imagem só.' },
    { title: 'Metadados para SEO local', desc: 'Grave título, descrição, palavras-chave e nome da empresa em campos EXIF exibidos pelo Windows e pela maioria dos programas.' },
    { title: 'Converter e comprimir', desc: 'Exporte em JPG, PNG, WebP, AVIF ou TIFF e diminua o tamanho para o site carregar mais rápido.' },
    { title: 'Importar por link', desc: 'Traga imagens de uma página pública ou de um link direto sem precisar baixar antes.' },
    { title: 'Cortar e editar', desc: 'Corte em uma proporção fixa ou livre antes de colocar a localização.' },
  ],

  metadataTitle: 'Quais dados EXIF a ferramenta grava na sua foto',
  metadataIntro: 'Colocar geotag em uma foto é gravar a localização dentro do próprio arquivo, nos metadados EXIF. Veja exatamente o que o PinPixl grava:',
  metadataHeaders: ['Informação', 'Campo EXIF', 'Exemplo'],
  metadataRows: [
    { field: 'Localização GPS', example: '23.5505° S, 46.6333° O' },
    { field: 'Título', example: 'Pão de queijo saindo do forno na nossa padaria em São Paulo' },
    { field: 'Descrição', example: 'Fornada da manhã na nossa loja da Vila Madalena.' },
    { field: 'Palavras-chave', example: 'padaria, pão de queijo, São Paulo' },
    { field: 'Nome da empresa', example: 'Nome da sua empresa' },
    { field: 'Cidade, país e mais', example: 'City: São Paulo; Country: Brasil' },
    { field: 'Data da foto, câmera', example: '2026:11:18 07:30:00' },
  ],
  metadataNote: 'JPG dá os resultados mais confiáveis. Os outros formatos são convertidos, e a leitura de alguns campos depende da plataforma onde você publica a imagem.',

  useCasesTitle: 'Quem precisa colocar localização nas fotos?',
  useCases: [
    { title: 'Empresas com Perfil da Empresa no Google', desc: 'Prepare fotos da fachada, da equipe e dos serviços com dados de localização coerentes antes de publicar.' },
    { title: 'Agências de SEO e marketing', desc: 'Coloque geotag em fotos de clientes em lote, com nome, palavras-chave e endereço certos para cada unidade.' },
    { title: 'Corretores e imobiliárias', desc: 'Registre onde cada foto do imóvel foi feita para manter anúncios e arquivos organizados.' },
    { title: 'Prestadores de serviço', desc: 'Comprove onde o serviço foi feito: as fotos de antes e depois levam a localização da obra.' },
    { title: 'Fotógrafos e viajantes', desc: 'Coloque local em fotos de câmeras sem GPS para vê-las no mapa do Google Fotos, Apple Fotos ou Lightroom.' },
    { title: 'Donos de sites', desc: 'Comprima e converta imagens para o site carregar rápido sem perder metadados úteis.' },
  ],

  seoTitle: 'Colocar geotag nas fotos ajuda no SEO local? A resposta sincera',
  seoParagraphs: [
    'Muita gente vende geotag como truque para ranquear. Não é. O Google nunca confirmou que os dados GPS de uma imagem sejam fator de ranqueamento, e as fotos publicadas no Perfil da Empresa no Google têm os dados EXIF removidos.',
    'Então para que serve? Para manter seu acervo de imagens organizado, ajudar apps de fotos e mapas a posicionar suas imagens corretamente e adicionar mais um dado de localização coerente aos arquivos publicados no seu site e em diretórios. É uma boa prática que apoia o SEO local, não um substituto.',
    'O que realmente conta na busca local é o que as pessoas e o Google veem: fotos reais do seu negócio, nomes de arquivo descritivos, texto alternativo útil e nome, endereço e telefone iguais em todos os lugares.',
  ],
  seoChecklistTitle: 'Checklist de SEO local para imagens',
  seoChecklist: [
    'Use fotos reais do seu espaço, da equipe e dos serviços. Evite banco de imagens.',
    'Dê nomes descritivos aos arquivos, como padaria-vila-madalena.jpg em vez de IMG_4521.jpg.',
    'Escreva um texto alternativo que descreva a imagem, não uma lista de palavras-chave.',
    'Comprima as imagens para a página carregar rápido no celular.',
    'Publique fotos novas no Perfil da Empresa no Google com frequência.',
    'Mantenha nome, endereço e telefone idênticos no site e em todos os cadastros.',
  ],

  privacyTitle: 'O que fazemos com as suas fotos',
  privacyParagraphs: [
    'Para gravar os metadados e converter formatos, sua foto é enviada por uma conexão criptografada ao nosso servidor, processada em memória e devolvida para você como download. Não armazenamos suas fotos, não guardamos cópias e não usamos para mais nada.',
    'Não existe cadastro, então nada liga as fotos a você. A busca de locais usa dados de mapas públicos.',
  ],

  formatsTitle: 'Formatos de imagem aceitos',
  formats: [
    { format: 'JPG / JPEG', support: 'Total', note: 'A melhor opção. GPS e todos os campos de texto funcionam em qualquer lugar.' },
    { format: 'PNG', support: 'Bom', note: 'O GPS é gravado, mas alguns sites e apps ignoram metadados de PNG.' },
    { format: 'WebP', support: 'Bom', note: 'Arquivos leves para sites. A leitura dos metadados varia conforme a plataforma.' },
    { format: 'HEIC / HEIF', support: 'Convertido', note: 'Fotos de iPhone. Exporte em JPG para a maior compatibilidade.' },
    { format: 'AVIF, TIFF', support: 'Convertido', note: 'Aceitos e exportados. Confira se a sua plataforma lê os metadados.' },
  ],

  faqTitle: 'Perguntas frequentes sobre localização em fotos',
  faqSubtitle: 'Dúvidas comuns sobre GPS, dados EXIF e metadados de imagens.',
  faqs: [
    { q: 'Como adicionar localização em uma foto?', a: 'Envie a foto acima, pesquise o endereço ou arraste o marcador no mapa e clique em aplicar. A ferramenta grava as coordenadas nos dados EXIF e você baixa a foto com geotag. Leva menos de um minuto e não precisa instalar nada.' },
    { q: 'A ferramenta é grátis mesmo?', a: 'Sim. Sem cadastro, sem marca d’água e sem plano pago. Você pode processar até 10 fotos por vez, com até 10 MB cada.' },
    { q: 'Colocar geotag nas fotos melhora meu ranking no Google?', a: 'Não diretamente. O Google não confirmou os dados GPS das imagens como fator de ranqueamento, e o Perfil da Empresa no Google remove os dados EXIF das fotos publicadas. Ajuda a organizar e manter as informações coerentes, mas fotos reais, bons nomes de arquivo e texto alternativo pesam mais.' },
    { q: 'Devo colocar localização nas fotos antes de enviar para o Perfil da Empresa no Google?', a: 'Não faz mal e mantém seus arquivos originais organizados, mas não espere uma melhora de posição só com isso. O mais importante é publicar com frequência fotos reais, recentes e de boa qualidade.' },
    { q: 'Como editar os dados EXIF de uma foto online?', a: 'No PinPixl você altera localização GPS, título, descrição, palavras-chave, nome da empresa, data e câmera pelo formulário e baixa o arquivo com os novos dados EXIF, sem instalar programas.' },
    { q: 'Vocês guardam as minhas fotos?', a: 'Não. As fotos são processadas na memória do nosso servidor só para gravar os metadados e converter o formato, e depois são devolvidas para você. Elas não são armazenadas nem compartilhadas.' },
    { q: 'Como saber se uma foto tem localização GPS?', a: 'Envie para a ferramenta e os metadados aparecem na hora. No Windows, clique com o botão direito no arquivo, Propriedades e depois Detalhes. No Mac, abra no Pré-Visualização e escolha Ferramentas › Mostrar Inspetor.' },
    { q: 'Dá para colocar localização em fotos HEIC do iPhone?', a: 'Sim. Aceitamos HEIC e HEIF. Para a melhor compatibilidade, exporte em JPG.' },
    { q: 'Posso colocar localização em várias fotos de uma vez?', a: 'Sim. Envie até 10 fotos, marque um local, aplique em todas e baixe tudo junto em um ZIP. Ainda dá para editar cada foto separadamente.' },
    { q: 'A foto perde qualidade?', a: 'Não, a menos que você escolha compressão ou outro formato. Com compressão em Nenhuma e formato original, só os metadados mudam.' },
  ],

  finalCtaTitle: 'Pronto para colocar localização nas suas fotos?',
  finalCtaText: 'Grátis, sem cadastro e em menos de um minuto.',
  finalCtaButton: 'Começar agora',
};

export default pt;
