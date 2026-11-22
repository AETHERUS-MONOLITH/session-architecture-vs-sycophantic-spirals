// One helper for every internal URL, so a project-path base never breaks links.
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

/** url('/costs/#costs') -> '<base>costs/#costs' */
export function url(p: string): string {
  if (!p.startsWith('/')) throw new Error('internal paths must start with /: ' + p);
  return BASE + p.slice(1);
}
export const base = BASE;
