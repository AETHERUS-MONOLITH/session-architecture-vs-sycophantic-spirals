// Pure model of the run timelines. A typed reimplementation of buildTrack() and render() from the
// frozen source script (archive/frozen/…_v1794606123-2939.html). Constants come from
// content/conditions.json, which tools/extract-fragments.mjs evaluates out of that script.
// Every string below is the string the source script produces; tests/unit/golden.test.ts compares
// the rendered output with the output of the original script for all 8 conditions × 4 lengths.
//
// The only intended difference is approved diff AD-01 (docs/provenance/APPROVED_DIFFS.md):
// in C3 a post-review snapshot follows every review, as in C2. Pass { ad01: false } to get the
// source drawing exactly (used by the golden test).

export interface Cond { id: string; name: string }
export interface Conditions {
  BUDGET: number;
  GATE: number;
  CONDS: Cond[];
  CORE: Record<string, true | number[]>;
  LABEL: Record<string, string>;
  DEFAULT_STATE: { n: number; c: string | null };
}
export interface State { n: number; c: string | null }
export interface Options { ad01: boolean }

export interface Block { kind: 'blk'; cls: string; grow: number | null; label: string; title: string; ad01?: true }
export interface Piece extends Block { grow: number }
export interface Inst { kind: 'inst'; cls: string; children: Piece[] }
export interface Hand { kind: 'hand'; label: string }
export type TrackNode = Block | Inst | Hand;

export interface LaneModel {
  id: string;
  code: string;
  name: string;
  suffix: '' | ' · opt.' | ' · ext.';
  inCore: boolean;
  selected: boolean;
  meta: [string, string];
  sessions: number;
  instances: number;
  track: TrackNode[];
}
export interface Model { n: number; c: string | null; dense: boolean; budget: number; lanes: LaneModel[] }

export const LENGTHS = [2, 5, 10, 20] as const;
export const AD01_TITLE = 'Post-review brief, recorded by a side call before work resumes';

const blk = (cls: string, grow: number | null, label: string, title: string): Block => ({ kind: 'blk', cls, grow, label, title });
const piece = (cls: string, grow: number, label: string, title: string): Piece => ({ kind: 'blk', cls, grow, label, title });
const inst = (cls: string, children: Piece[]): Inst => ({ kind: 'inst', cls, children });
const hand = (label: string): Hand => ({ kind: 'hand', label });

export function sessionsFor(cfg: Conditions, n: number): number {
  return Math.ceil(cfg.BUDGET / n);
}

export function isCore(cfg: Conditions, c: string, n: number): boolean {
  const core = cfg.CORE[c];
  return c === 'C0' || c === 'C0R' || (Array.isArray(core) && core.indexOf(n) !== -1);
}

export function buildTrack(cfg: Conditions, c: string, n: number, opts: Options = { ad01: true }): TrackNode[] {
  const { BUDGET, GATE } = cfg;
  const t: TrackNode[] = [];
  t.push(blk('v0', null, 'V0', 'Brief V0 with planted items: start input of every cell'));
  if (c === 'C0') {
    t.push(inst('', [piece('work', BUDGET, BUDGET + ' turns', 'One continuous session')]));
  } else if (c === 'C0R') {
    const pr: Piece[] = [];
    for (let q = 0; q < 4; q++) {
      if (q > 0) {
        pr.push(piece('rev', GATE, 'Rv', 'Review step inside the same context, after turn ' + q * 10));
        pr.push(piece('snap', 0.3, '', 'Post-review brief, recorded by a side call after the review at turn ' + q * 10));
      }
      pr.push(piece('work', 10, '10 t', 'Turns ' + (q * 10 + 1) + ' to ' + (q * 10 + 10)));
    }
    t.push(inst('', pr));
  } else {
    const sessions = sessionsFor(cfg, n);
    for (let i = 0; i < sessions; i++) {
      const turns = Math.min(n, BUDGET - i * n);
      const last = i === sessions - 1;
      const mb = c === 'C4' && i % 2 === 1 ? 'mb' : '';
      const parts: Piece[] = [];
      if (i > 0 && c !== 'C1' && c !== 'C2X') {
        parts.push(piece('rev' + (mb ? ' mb' : ''), GATE, 'Rv', 'Review of the handed-over report or summary, first task of this instance'));
        if (c !== 'C3') {
          parts.push(piece('snap' + (mb ? ' mb' : ''), 0.3, '', AD01_TITLE));
        } else if (opts.ad01) {
          // AD-01: the decided rule (S05-T01 "Post-review snapshot: after every review …") applies to C3 too.
          parts.push({ ...piece('snap', 0.3, '', AD01_TITLE), ad01: true });
        }
      }
      parts.push(piece('work' + (mb ? ' mb' : ''), turns, turns + ' t', 'Session ' + (i + 1) + ': ' + turns + ' turn pairs'));
      if (!last && (c === 'C1' || c === 'C1R')) parts.push(piece('sum', GATE, 'S', 'Free summary, written by this instance before it ends'));
      if (!last && (c === 'C2' || c === 'C2X' || c === 'C4')) parts.push(piece('rep', GATE, 'R', 'Structured report, written by this instance before it ends'));
      t.push(inst(mb, parts));
      if (!last) {
        if (c === 'C1' || c === 'C1R') t.push(hand('summary + brief'));
        if (c === 'C2' || c === 'C2X' || c === 'C4') t.push(hand('report + brief'));
        if (c === 'C3') {
          t.push(hand('transcript'));
          t.push(inst('ind', [piece('rep ind', GATE, 'R', 'Separate instance writes the report from the transcript')]));
          t.push(hand('report + brief'));
        }
      }
    }
  }
  t.push(blk('score', null, 'score', 'Final brief scored by the calibrated judge'));
  return t;
}

export function buildLane(cfg: Conditions, cd: Cond, state: State, opts: Options = { ad01: true }): LaneModel {
  const inCore = isCore(cfg, cd.id, state.n);
  const suffix = inCore ? '' : cd.id === 'C2X' ? ' · opt.' : ' · ext.';
  let meta: [string, string];
  let sessions = 1;
  let instances = 1;
  if (cd.id === 'C0') {
    meta = ['1 session', '1 instance'];
  } else if (cd.id === 'C0R') {
    meta = ['1 session', '3 reviews'];
  } else {
    sessions = sessionsFor(cfg, state.n);
    instances = cd.id === 'C3' ? 2 * sessions - 1 : sessions;
    meta = [sessions + ' sessions', instances + ' instances'];
  }
  return {
    id: cd.id,
    code: cfg.LABEL[cd.id] || cd.id,
    name: cd.name,
    suffix,
    inCore,
    selected: state.c === cd.id,
    meta,
    sessions,
    instances,
    track: buildTrack(cfg, cd.id, state.n, opts),
  };
}

export function buildModel(cfg: Conditions, state: State, opts: Options = { ad01: true }): Model {
  return {
    n: state.n,
    c: state.c,
    dense: state.n <= 5,
    budget: cfg.BUDGET,
    lanes: cfg.CONDS.map((cd) => buildLane(cfg, cd, state, opts)),
  };
}

/** Grid button match rule of the source render(): C0/C0R ignore the length. */
export function cellSelected(state: State, c: string | undefined, n: number | null): boolean {
  return c === state.c && (c === 'C0' || c === 'C0R' || n === state.n);
}

/** Flattened list of all blocks (including those inside instances) for counting. */
export function flatBlocks(track: TrackNode[]): Block[] {
  const out: Block[] = [];
  for (const node of track) {
    if (node.kind === 'blk') out.push(node);
    else if (node.kind === 'inst') out.push(...node.children);
  }
  return out;
}

/** Parse ?c=&n= (URL state enhancement). Invalid values fall back to the source default. */
export function stateFromSearch(cfg: Conditions, search: string): State {
  const p = new URLSearchParams(search);
  const state: State = { ...cfg.DEFAULT_STATE };
  const n = Number(p.get('n'));
  if ((LENGTHS as readonly number[]).includes(n)) state.n = n;
  const c = p.get('c');
  if (c && cfg.CONDS.some((cd) => cd.id === c)) state.c = c;
  return state;
}

export function searchFromState(cfg: Conditions, state: State): string {
  const p = new URLSearchParams();
  if (state.c) p.set('c', state.c);
  if (state.n !== cfg.DEFAULT_STATE.n || state.c) p.set('n', String(state.n));
  const s = p.toString();
  return s ? '?' + s : '';
}
