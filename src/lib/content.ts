// Build-time access to the content source: fragments (content/fragments/*.html, extracted verbatim
// from the frozen grid), site chrome (content/chrome.yml) and the item mapping (content/mapping.csv).
// Pages compose fragments; they never retype content.
import { load as loadYaml } from 'js-yaml';
import chromeRaw from '../../content/chrome.yml?raw';
import mappingRaw from '../../content/mapping.csv?raw';
import { url } from './url';

const RAW = import.meta.glob('/content/fragments/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface Route { path: string; nav: string; title: string }
export interface Chrome {
  site: Record<string, string>;
  routes: Route[];
  secondary_routes: Route[];
  overview: Record<string, string>;
  versions: {
    heading: string; intro: string; sha_label: string; archived_as_label: string;
    entries: { id: string; label: string; status: string; files: { text?: string; href?: string; path: string; sha256: string }[] }[];
  };
  site_changes: {
    heading: string; intro: string;
    entries: { id: string; label: string; items: string[]; cost_note_heading?: string; cost_note?: string[] }[];
  };
}
export const chrome = loadYaml(chromeRaw) as Chrome;

export function routeByPath(p: string): Route {
  const r = [...chrome.routes, ...chrome.secondary_routes].find((x) => x.path === p);
  if (!r) throw new Error('unknown route ' + p);
  return r;
}

export function fragment(name: string): string {
  const html = RAW[`/content/fragments/${name}.html`];
  if (html === undefined) throw new Error('missing fragment ' + name);
  return html;
}

// In-page links of the source (#scoring, …) and their targets on the topical routes,
// taken from the column link_target_on_route of the mapping.
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift()!;
  return rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
export const mapping = parseCsv(mappingRaw);
const LINK_TARGETS: Record<string, string> = {};
for (const r of mapping) {
  if (r.link_target_on_route) {
    const hash = r.link_target_on_route.slice(r.link_target_on_route.indexOf('#'));
    LINK_TARGETS[hash] = r.link_target_on_route;
  }
}

export type Mode = 'full' | 'topic';
export interface ComposeOptions {
  mode: Mode;
  /** Placeholder name -> fragment to put there instead ('' removes it). Default: the named fragment. */
  replace?: Record<string, string>;
}

function rewriteLinks(html: string, mode: Mode): string {
  if (mode === 'full') return html;
  return html.replace(/href="(#[^"]+)"/g, (m, hash: string) => {
    const target = LINK_TARGETS[hash];
    if (!target) throw new Error('no route target for ' + hash);
    return `href="${url(target)}"`;
  });
}

/** Fragment HTML wrapped in a display:contents marker, with nested placeholders resolved. */
export function compose(name: string, opts: ComposeOptions): string {
  let html = fragment(name).trimEnd();
  html = html.replace(/<!--fragment:([A-Za-z0-9-]+)-->/g, (m, inner: string) => {
    const sub = opts.replace && inner in opts.replace ? opts.replace[inner] : inner;
    return sub ? compose(sub, opts) : '';
  });
  return `<div class="frag" data-fragment="${name}">${rewriteLinks(html, opts.mode)}</div>`;
}
