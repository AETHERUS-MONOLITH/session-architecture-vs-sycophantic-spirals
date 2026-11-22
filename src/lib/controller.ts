// Client controller for the factorial grid and run timelines (on /grid/ and /full/).
// Behaviour as in the source script: grid cells set the condition and, where they have one, the
// length; length buttons set the length; every change re-renders; a cell click scrolls #runs into
// view. Additions: URL state ?c=&n= and no smooth scrolling under prefers-reduced-motion: reduce.
import { render } from './render';
import { searchFromState, stateFromSearch, type Conditions, type State } from './timeline';

export function initGrid(win: Window, cfg: Conditions): { state: State } {
  const doc = win.document;
  const holder = { state: stateFromSearch(cfg, win.location.search) };

  const update = (writeUrl: boolean) => {
    render(doc, doc, cfg, holder.state);
    if (writeUrl && win.history && win.history.replaceState) {
      const url = win.location.pathname + searchFromState(cfg, holder.state) + win.location.hash;
      win.history.replaceState(null, '', url);
    }
  };
  const scrollToRuns = () => {
    const runs = doc.getElementById('runs');
    const reduce = typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (runs && runs.scrollIntoView) runs.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  doc.querySelectorAll<HTMLElement>('.seg-btn').forEach((b) => {
    b.addEventListener('click', () => {
      holder.state = { ...holder.state, n: Number(b.dataset.n) };
      update(true);
    });
  });
  doc.querySelectorAll<HTMLElement>('button.cell').forEach((b) => {
    b.addEventListener('click', () => {
      holder.state = { c: b.dataset.c ?? null, n: b.dataset.n ? Number(b.dataset.n) : holder.state.n };
      update(true);
      scrollToRuns();
    });
  });
  update(false);
  if (holder.state.c && !win.location.hash) {
    const runs = doc.getElementById('runs');
    if (runs && runs.scrollIntoView) runs.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  return holder;
}
