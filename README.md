# Diagnóstico Ecossistema do Lucro

Páginas do Diagnóstico institucional (v0.6) e do Plano de recomendações (v3), no Design System Ecossistema do Lucro, adaptadas para web e celular.

- `index.html` · Diagnóstico institucional
- `recomendacoes.html` · Plano de recomendações
- `assets/` · CSS, JS, fontes (Host Grotesk, Anisette) e imagens (logo, brasão, retratos P&B)

Site estático, publicado pelo GitHub Pages a partir da branch `main`.

As duas páginas são protegidas por senha: o HTML publicado está criptografado (AES-256 + HMAC-SHA256, chave PBKDF2-SHA256) e só é aberto no navegador com a senha. Os originais e o script `proteger.ps1` ficam fora deste repositório, na pasta `site-fonte/`.
