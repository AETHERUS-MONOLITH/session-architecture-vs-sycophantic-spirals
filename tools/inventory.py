#!/usr/bin/env python3
"""Generate a stable-ID inventory of every content element in the frozen grid.
Usage: python3 -I tools/inventory.py <frozen.html> <out.json> <out.md>
IDs: S<nn> section, S<nn>-H<k> heading, S<nn>-P<k> paragraph, S<nn>-L<k>-I<j> list item,
S<nn>-T<k>-R<j> table row (R00 = header), S<nn>-B<k> button, S<nn>-A<k> link, S<nn>-K<k> key/legend chip.
Each element carries the SHA-256 of its whitespace-normalised text, so a parity script can check
that every source element appears verbatim on the site."""
import sys, json, hashlib, re
from bs4 import BeautifulSoup
src, oj, om = sys.argv[1:4]
soup = BeautifulSoup(open(src, encoding='utf-8').read(), 'html.parser')
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
sha = lambda s: hashlib.sha256(s.encode()).hexdigest()[:16]
items = []
def add(i, kind, el, text, extra=None):
    d = {'id': i, 'kind': kind, 'tag': el.name if el is not None else '', 'text': text, 'sha16': sha(text)}
    if extra: d.update(extra)
    items.append(d)
hdr = soup.find('header') or soup.body
add('S00', 'header', hdr, norm(hdr.get_text(' ')) if hdr else '')
hel = [el for el in (hdr.find_all(True) if hdr else [])
       if el.name in ('h1', 'p', 'a') or (not el.find_parent(['h1', 'p', 'a'])
           and norm(''.join(t for t in el.find_all(string=True, recursive=False))))]
for k, el in enumerate(hel, 1):
    add(f'S00-E{k:02d}', el.name, el, norm(el.get_text(' ')), {'href': el.get('href')} if el.name == 'a' else None)
for n, sec in enumerate(soup.find_all('section'), 1):
    S = f'S{n:02d}'
    add(S, 'section', sec, norm(sec.find('h2').get_text(' ')), {'anchor': sec.get('id'), 'class': ' '.join(sec.get('class', []))})
    tb = set()
    c = {'H': 0, 'P': 0, 'L': 0, 'T': 0, 'B': 0, 'A': 0, 'D': 0}
    for el in sec.find_all(True):
        if el.name in ('h2', 'h3', 'h4'):
            c['H'] += 1; add(f'{S}-H{c["H"]:02d}', 'heading', el, norm(el.get_text(' ')), {'anchor': el.get('id')})
        elif el.name == 'p' and not el.find_parent(['li', 'td', 'th', 'table']):
            c['P'] += 1; add(f'{S}-P{c["P"]:02d}', 'paragraph', el, norm(el.get_text(' ')))
        elif el.name in ('ul', 'ol') and not el.find_parent(['ul', 'ol', 'table']):
            c['L'] += 1
            for j, li in enumerate(el.find_all('li', recursive=False), 1):
                add(f'{S}-L{c["L"]:02d}-I{j:02d}', 'list-item', li, norm(li.get_text(' ')))
        elif el.name == 'table':
            c['T'] += 1
            for j, tr in enumerate(el.find_all('tr')):
                cells = [norm(td.get_text(' ')) for td in tr.find_all(['th', 'td'])]
                add(f'{S}-T{c["T"]:02d}-R{j:02d}', 'table-row' if j else 'table-header', tr, ' | '.join(cells), {'cells': cells})
        elif el.name == 'button':
            c['B'] += 1; add(f'{S}-B{c["B"]:02d}', 'control', el, norm(el.get_text(' ')),
                             {'dom_id': el.get('id'), 'data': {k: v for k, v in el.attrs.items() if k.startswith('data-') or k.startswith('aria-')}, 'class': ' '.join(el.get('class', []))})
        elif el.name == 'a':
            c['A'] += 1; add(f'{S}-A{c["A"]:02d}', 'link', el, norm(el.get_text(' ')), {'href': el.get('href')})
        if el.name in ('div', 'figure') and el.get('id') and el.get('id') not in ('status',):
            c['D'] += 1; add(f'{S}-D{c["D"]:02d}', 'dynamic-container', el, norm(el.get_text(' '))[:200], {'dom_id': el.get('id')})
        elif el.name not in ('p','li','tr','td','th','button','a','h2','h3','h4','table','ul','ol','section','script','style') \
             and not el.find_parent(['p','li','table','button','a','h2','h3','h4']) \
             and norm(''.join(t for t in el.find_all(string=True, recursive=False))) \
             and not any(id(pa) in tb for pa in el.parents):
            if not el.find(['p','ul','ol','table','button']): tb.add(id(el))
            c['X'] = c.get('X', 0) + 1
            add(f'{S}-X{c["X"]:02d}', 'text-block', el, norm(el.get_text(' ')) if not el.find(['p','ul','ol','table','button']) else norm(''.join(t for t in el.find_all(string=True, recursive=False))),
                {'class': ' '.join(el.get('class', [])), 'dom_id': el.get('id')})
        if el.name == 'div' and el.get('id') == 'status':
            c['D'] += 1; add(f'{S}-D{c["D"]:02d}', 'anchor-container', el, 'Status of design details', {'dom_id': 'status'})
json.dump({'source': src, 'items': items}, open(oj, 'w'), ensure_ascii=False, indent=1)
with open(om, 'w') as f:
    f.write('| ID | Kind | Anchor / DOM id / href | Text (first 140 chars) | sha16 |\n|---|---|---|---|---|\n')
    for d in items:
        ref = d.get('anchor') or d.get('dom_id') or d.get('href') or ''
        t = d['text'][:140].replace('|', '/')
        f.write(f"| {d['id']} | {d['kind']} | {ref or ''} | {t} | {d['sha16']} |\n")
from collections import Counter
print(len(items), Counter(d['kind'] for d in items))
