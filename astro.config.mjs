// Static build. The project-path base comes from SITE_BASE so the same code works on
// https://aetherus-monolith.github.io/session-architecture-vs-sycophantic-spirals/ and under any other base.
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.SITE_BASE ?? '/session-architecture-vs-sycophantic-spirals/';
const site = process.env.SITE_URL ?? 'https://aetherus-monolith.github.io';

// Serves the immutable 3 Nov PDFs from archive/ (single copy in git) at <base>archive/2026-11-03/.
function archivePdfs() {
  const from = path.resolve('archive/historical/2026-11-03');
  const files = fs.readdirSync(from).filter((f) => f.endsWith('.pdf'));
  return {
    name: 'archive-pdfs',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const to = path.join(dir.pathname, 'archive', '2026-11-03');
        fs.mkdirSync(to, { recursive: true });
        for (const f of files) fs.copyFileSync(path.join(from, f), path.join(to, f));
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const m = req.url && req.url.match(/archive\/2026-11-03\/([^/?#]+\.pdf)$/);
          if (m && files.includes(decodeURIComponent(m[1]))) {
            res.setHeader('Content-Type', 'application/pdf');
            fs.createReadStream(path.join(from, decodeURIComponent(m[1]))).pipe(res);
            return;
          }
          next();
        });
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', assets: '_assets' },
  compressHTML: false,
  devToolbar: { enabled: false },
  integrations: [archivePdfs()],
});
