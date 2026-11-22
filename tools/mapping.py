#!/usr/bin/env python3
"""Assign every inventory item to its target route and anchor (proposed IA, Gate 1).
Usage: python3 -I tools/mapping.py docs/source_inventory.json docs/SOURCE_TO_SITE_MAPPING.csv
Every item also appears on /full/ in original order; the column 'full_anchor' gives its anchor there."""
import sys, json, csv
inv = json.load(open(sys.argv[1]))['items']
SEC = {  # section -> (route, anchor on that route, original anchor on /full/)
 'S00': ('/', 'top', 'top'),
 'S01': ('/grid/', 'grid', 'grid'),
 'S02': ('/grid/', 'conditions', 'conditions'),
 'S03': ('/grid/', 'runs', 'runs'),
 'S04': ('/hypotheses/', 'hypotheses', 'hypotheses'),
 'S05': ('/handoffs/', 'handoff', 'handoff'),
 'S06': ('/stopping-rule/', 'stopping-rule', 'stopping-rule'),
 'S07': ('/scoring/', 'scoring', 'scoring'),
 'S08': ('/costs/', 'costs', 'costs'),
 'S09': ('/decisions/', 'open', 'open'),
 'S10': ('/operations/', 'artifacts', 'artifacts'),
 'S11': ('/operations/', 'instance-state', 'instance-state'),
 'S12': ('/operations/', 'error-path', 'error-path'),
 'S13': ('/changelog/', 'changes', 'changes'),
 'S14': ('/', 'tasks-outcomes', 'tasks-outcomes'),
}
rows = []
for d in inv:
    s = d['id'][:3]
    route, anchor, full = SEC[s]
    # the status table and its caption move from the handoff section to /decisions/#status
    if d['id'] in ('S05-X32', 'S05-D01', 'S05-A02', 'S05-A03', 'S05-A04', 'S05-A05') or d['id'].startswith('S05-T01'):
        route, anchor, full = '/decisions/', 'status', 'status'
    href = d.get('href')
    target = {'#scoring': '/scoring/#scoring', '#costs': '/costs/#costs', '#stopping-rule': '/stopping-rule/#stopping-rule',
              '#changes': '/changelog/#changes'}.get(href, '') if href else ''
    rows.append({'id': d['id'], 'kind': d['kind'], 'route': route, 'anchor': anchor,
                 'full_route': '/full/', 'full_anchor': full, 'sha16': d['sha16'], 'link_target_on_route': target,
                 'text_start': d['text'][:80]})
with open(sys.argv[2], 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
from collections import Counter
print(len(rows), Counter(r['route'] for r in rows))
