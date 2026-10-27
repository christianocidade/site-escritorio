// Monta as páginas do site a partir de src/pages/*.html.
// Uso: node build.mjs   (gera os .html na raiz e o sitemap.xml)
//
// Cada página começa com um comentário JSON de metadados:
// <!--{ "title": "...", "description": "...", "path": "/slug", "nav": "areas", "breadcrumb": [["Áreas", "/areas-de-atuacao"]] }-->
// O cabeçalho, o rodapé, as tags de SEO e o JSON-LD (incluindo o FAQPage,
// extraído dos <details> da seção .faq) são gerados aqui.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

// Troque pela URL definitiva quando o domínio próprio estiver no ar.
const SITE = 'https://site-escritorio-eight.vercel.app';
const NAME = 'Christiano Cidade Advocacia';
const OAB = 'OAB/PR 67.512';
const PHONE = '+55-43-99120-4613';
const WA = 'https://wa.me/5543991204613';
const ADDR = { street: 'Rua Mato Grosso, 1412, apto 53', district: 'Centro', city: 'Londrina', state: 'PR', cep: '86010-180' };
const ADDRESS = `${ADDR.street} · ${ADDR.city}/${ADDR.state} · CEP ${ADDR.cep}`;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDR.street}, ${ADDR.city} - ${ADDR.state}, ${ADDR.cep}`)}`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const wa = (msg) => `${WA}?text=${encodeURIComponent(msg)}`;

const NAV = [
  ['areas', '/areas-de-atuacao', 'Áreas de atuação'],
  ['como', '/#como-funciona', 'Como funciona'],
  ['sobre', '/#sobre', 'Sobre'],
  ['duvidas', '/#duvidas', 'Dúvidas'],
];

const ORG = {
  '@type': ['LegalService', 'Attorney'],
  '@id': `${SITE}/#escritorio`,
  name: NAME,
  url: `${SITE}/`,
  logo: `${SITE}/assets/img/logo.png`,
  image: `${SITE}/assets/img/og.jpg`,
  telephone: PHONE,
  address: {
    '@type': 'PostalAddress', streetAddress: ADDR.street, addressLocality: ADDR.city,
    addressRegion: ADDR.state, postalCode: ADDR.cep, addressCountry: 'BR',
  },
  hasMap: MAPS,
  priceRange: '$$',
  description: 'Advocacia em Direito Bancário: revisão de contratos bancários e de financiamento de veículos, defesa em ação de busca e apreensão e indicação de condutor.',
  areaServed: [{ '@type': 'City', name: 'Londrina' }, { '@type': 'Country', name: 'Brasil' }],
  availableLanguage: 'pt-BR',
  founder: { '@id': `${SITE}/#christiano` },
  knowsAbout: ['Direito Bancário', 'Revisão de contrato bancário', 'Juros abusivos', 'Busca e apreensão de veículo', 'Indicação de condutor'],
};
const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#christiano`,
  name: 'Christiano Cidade',
  jobTitle: 'Advogado',
  identifier: OAB,
  image: `${SITE}/assets/img/christiano-cidade.jpg`,
  worksFor: { '@id': `${SITE}/#escritorio` },
  url: `${SITE}/#sobre`,
};

const icons = readFileSync('src/partials/icons.svg', 'utf8').trim();

function header(nav) {
  const links = NAV.map(([k, href, label]) =>
    `<a href="${href}"${k === nav ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ');
  return `<a class="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
  <header class="header glass">
    <div class="wrap nav">
      <a href="/" class="brand" aria-label="${NAME} — início">
        <span class="brand-mono" aria-hidden="true">CC<span>A</span></span>
        <span class="brand-name"><strong>Christiano Cidade</strong><small>Advocacia</small></span>
      </a>
      <nav class="nav-links" aria-label="Principal">
        ${links}
      </nav>
      <a class="btn btn-primary btn-sm" href="${WA}" target="_blank" rel="noopener">
        <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> Fale pelo WhatsApp
      </a>
      <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-mobile">
        <svg class="icon" style="width:28px;height:28px" aria-hidden="true"><use href="#i-menu"/></svg>
      </button>
    </div>
    <nav class="mobile-menu" id="menu-mobile" aria-label="Menu móvel">
      ${links}
      <a class="btn btn-primary" href="${WA}" target="_blank" rel="noopener">Fale pelo WhatsApp</a>
    </nav>
  </header>`;
}

const footer = `<footer class="footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <a href="/" class="brand" aria-label="${NAME} — início">
            <span class="brand-mono" aria-hidden="true">CC<span>A</span></span>
            <span class="brand-name"><strong>Christiano Cidade</strong><small>Advocacia</small></span>
          </a>
          <p class="muted" style="margin-top:18px;font-size:15px">Christiano Cidade · ${OAB}<br>WhatsApp <a href="${WA}" target="_blank" rel="noopener">(43) 99120-4613</a><br><a href="${MAPS}" target="_blank" rel="noopener">${ADDR.street}<br>${ADDR.district} · ${ADDR.city}/${ADDR.state} · CEP ${ADDR.cep}</a></p>
        </div>
        <div>
          <h2>Áreas de atuação</h2>
          <ul>
            <li><a href="/revisao-de-contrato-bancario">Revisão de contrato bancário</a></li>
            <li><a href="/revisao-de-financiamento-de-veiculo">Revisão de financiamento de veículo</a></li>
            <li><a href="/defesa-busca-e-apreensao">Defesa em busca e apreensão</a></li>
            <li><a href="/indicacao-de-condutor">Indicação de condutor</a></li>
          </ul>
        </div>
        <div>
          <h2>Navegação</h2>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/areas-de-atuacao">Todas as áreas</a></li>
            <li><a href="/#como-funciona">Como funciona</a></li>
            <li><a href="/#sobre">Sobre</a></li>
            <li><a href="/#duvidas">Dúvidas frequentes</a></li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li><a href="/politica-de-privacidade">Política de privacidade</a></li>
          </ul>
        </div>
      </div>
      <div class="legal">
        <p>Conteúdo de caráter exclusivamente informativo, nos termos do Provimento nº 205/2021 do Conselho Federal da OAB. Não substitui a análise individual do seu caso.</p>
        <p>Escritório de advocacia privado, sem vínculo com bancos, financeiras ou órgãos governamentais.</p>
        <p>© ${new Date().getFullYear()} ${NAME}.</p>
      </div>
    </div>
  </footer>

  <a class="wa-float" href="${WA}" target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp">
    <svg class="icon" style="width:28px;height:28px" aria-hidden="true"><use href="#i-wa"/></svg>
  </a>`;

function faqSchema(body) {
  const faq = body.match(/<div class="faq(?: [^"]*)?"[^>]*>([\s\S]*?)<\/div>/);
  if (!faq) return null;
  const items = [...faq[1].matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)];
  if (!items.length) return null;
  const text = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(([, q, a]) => ({
      '@type': 'Question', name: text(q),
      acceptedAnswer: { '@type': 'Answer', text: text(a) },
    })),
  };
}

function render(meta, body) {
  const url = SITE + (meta.path === '/' ? '/' : meta.path);
  const graph = [];
  if (meta.path === '/') graph.push(ORG, PERSON, { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: NAME, inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#escritorio` } });
  graph.push({
    '@type': 'WebPage', '@id': `${url}#pagina`, url, name: meta.title, description: meta.description,
    inLanguage: 'pt-BR', isPartOf: { '@id': `${SITE}/#site` }, about: { '@id': `${SITE}/#escritorio` },
    ...(meta.modified ? { dateModified: meta.modified } : {}),
  });
  if (meta.service) graph.push({
    '@type': 'Service', name: meta.service, serviceType: meta.service, url,
    provider: { '@id': `${SITE}/#escritorio` }, areaServed: { '@type': 'Country', name: 'Brasil' },
    description: meta.description,
  });
  if (meta.breadcrumb) graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [['Início', '/'], ...meta.breadcrumb].map(([name, path], i) => ({
      '@type': 'ListItem', position: i + 1, name, item: SITE + path,
    })),
  });
  const faq = faqSchema(body);
  if (faq) graph.push(faq);

  const robots = meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1';
  const crumbs = meta.breadcrumb ? `<nav class="breadcrumb" aria-label="Você está em">
            <ol>
              <li><a href="/">Início</a></li>
              ${meta.breadcrumb.map(([name, path], i, a) => i === a.length - 1
                ? `<li aria-current="page">${name}</li>` : `<li><a href="${path}">${name}</a></li>`).join('\n              ')}
            </ol>
          </nav>` : '';

  body = body
    .replaceAll('{{BREADCRUMB}}', crumbs)
    .replace(/\{\{WA:([^}]+)\}\}/g, (_, msg) => wa(msg))
    .replaceAll('{{WA}}', WA)
    .replaceAll('{{MAPS}}', MAPS)
    .replaceAll('{{ADDRESS}}', ADDRESS);

  return `<!DOCTYPE html>
<!-- Gerado por build.mjs a partir de src/pages. Edite a fonte, não este arquivo. -->
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}" />
  <meta name="robots" content="${robots}" />
  ${meta.noindex ? '' : `<link rel="canonical" href="${url}" />\n`}  <meta name="theme-color" content="#1B2A4A" />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:site_name" content="${NAME}" />
  <meta property="og:title" content="${esc(meta.ogTitle || meta.title)}" />
  <meta property="og:description" content="${esc(meta.description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/assets/img/og.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${NAME} — ${OAB}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="icon" href="/assets/img/icon-192.png" type="image/png" sizes="192x192" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Manrope:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/site.css" />

  <script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
  </script>
</head>
<body>
  ${icons}

  ${header(meta.nav)}

  <main id="conteudo-principal">
${body.trim()}
  </main>

  ${footer}

  <script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [];
for (const file of readdirSync('src/pages').filter((f) => f.endsWith('.html')).sort()) {
  const src = readFileSync(`src/pages/${file}`, 'utf8');
  const m = src.match(/^<!--(\{[\s\S]*?\})-->\n/);
  if (!m) throw new Error(`${file}: faltou o comentário de metadados no topo`);
  const meta = JSON.parse(m[1]);
  writeFileSync(file, render(meta, src.slice(m[0].length)));
  if (!meta.noindex) sitemap.push({ loc: SITE + (meta.path === '/' ? '/' : meta.path), priority: meta.path === '/' ? '1.0' : meta.priority || '0.8' });
  console.log('ok', file);
}

writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log('ok sitemap.xml, robots.txt');
