# Site — Christiano Cidade Advocacia

Site estático (HTML + CSS), hospedado na Vercel.

- Edite as páginas em `src/pages/*.html` e rode `node build.mjs`. O script gera os `.html` da raiz, o `sitemap.xml` e o `robots.txt`.
- Cabeçalho, rodapé, meta tags, Open Graph e JSON-LD (incluindo o FAQPage das perguntas frequentes) ficam em `build.mjs`.
- Quando o domínio próprio estiver no ar, troque a constante `SITE` em `build.mjs` e rode o build de novo.
- Estilos em `assets/css/site.css`, que segue a identidade visual (cores e fontes).
