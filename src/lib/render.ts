// DOM renderer for the timeline model. Produces the same elements, classes, flex weights, labels
// and titles as the source script's blk()/inst()/hand()/render(); see tests/unit/golden.test.ts.
import { buildModel, cellSelected, type Block, type Conditions, type Model, type Options, type Piece, type State, type TrackNode } from './timeline';

function blkEl(doc: Document, b: Block): HTMLElement {
  const d = doc.createElement('div');
  d.className = 'b ' + b.cls;
  if (b.grow !== null) d.style.flex = b.grow + ' 1 0';
  d.textContent = b.label || '';
  if (b.title) d.title = b.title;
  if (b.ad01) d.setAttribute('data-approved-diff', 'AD-01');
  return d;
}

function instEl(doc: Document, cls: string, children: Piece[]): HTMLElement {
  const g = doc.createElement('div');
  g.className = 'inst' + (cls ? ' ' + cls : '');
  let total = 0;
  children.forEach((ch) => { g.appendChild(blkEl(doc, ch)); total += ch.grow; });
  g.style.flex = total + ' 1 0';
  return g;
}

function handEl(doc: Document, label: string): HTMLElement {
  const h = doc.createElement('div');
  h.className = 'hand';
  h.title = 'Cut: instance ends. Handed over: ' + label;
  h.appendChild(blkEl(doc, { kind: 'blk', cls: 'cut', grow: null, label: '', title: '' }));
  const l = doc.createElement('span');
  l.className = 'lbl';
  l.append(label, doc.createElement('br'), '→');
  h.appendChild(l);
  return h;
}

function trackEl(doc: Document, nodes: TrackNode[]): HTMLElement {
  const t = doc.createElement('div');
  t.className = 'track';
  for (const node of nodes) {
    if (node.kind === 'blk') t.appendChild(blkEl(doc, node));
    else if (node.kind === 'inst') t.appendChild(instEl(doc, node.cls, node.children));
    else t.appendChild(handEl(doc, node.label));
  }
  return t;
}

function twoLines(doc: Document, el: HTMLElement, a: string, b: string) {
  el.append(a, doc.createElement('br'), b);
}

export function renderLanes(doc: Document, lanes: HTMLElement, model: Model): void {
  lanes.innerHTML = '';
  lanes.classList.toggle('dense', model.dense);
  for (const lm of model.lanes) {
    const lane = doc.createElement('div');
    lane.className = 'lane' + (lm.selected ? ' sel' : '');
    const lab = doc.createElement('div');
    lab.className = 'rowlab';
    const b = doc.createElement('b');
    b.textContent = lm.code;
    const s = doc.createElement('span');
    s.textContent = lm.name + lm.suffix;
    lab.append(b, s);
    const meta = doc.createElement('div');
    meta.className = 'meta';
    twoLines(doc, meta, lm.meta[0], lm.meta[1]);
    lane.appendChild(lab);
    lane.appendChild(trackEl(doc, lm.track));
    lane.appendChild(meta);
    lanes.appendChild(lane);
  }
}

/** Full render() of the source: lanes, length buttons, grid cell selection, budget label. */
export function render(doc: Document, root: ParentNode, cfg: Conditions, state: State, opts: Options = { ad01: true }): Model {
  const model = buildModel(cfg, state, opts);
  const lanes = root.querySelector<HTMLElement>('#lanes');
  if (lanes) renderLanes(doc, lanes, model);
  root.querySelectorAll<HTMLElement>('.seg-btn').forEach((b) => {
    b.setAttribute('aria-pressed', String(Number(b.dataset.n) === state.n));
  });
  root.querySelectorAll<HTMLElement>('button.cell').forEach((b) => {
    const match = cellSelected(state, b.dataset.c, b.dataset.n ? Number(b.dataset.n) : null);
    b.classList.toggle('sel', match);
    // Enhancement: expose the selection to assistive technology (the source shows it visually only).
    b.setAttribute('aria-pressed', String(match));
  });
  const budget = root.querySelector('#budget-label');
  if (budget) budget.textContent = String(cfg.BUDGET);
  return model;
}
