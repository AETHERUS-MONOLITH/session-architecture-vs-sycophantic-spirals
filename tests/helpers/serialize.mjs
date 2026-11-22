// Structural serialization of rendered timeline DOM, shared by the fixture generator
// (tools/original-golden.mjs, runs the ORIGINAL source script) and the golden test.
export function ser(node) {
  if (node.nodeType === 3) return node.nodeValue;
  if (node.nodeType !== 1) return null;
  const a = {};
  for (const attr of ['class', 'title']) if (node.hasAttribute(attr)) a[attr] = node.getAttribute(attr);
  if (node.style && node.style.flex) a.flex = node.style.flex;
  if (node.hasAttribute('data-approved-diff')) a.approvedDiff = node.getAttribute('data-approved-diff');
  return { t: node.tagName.toLowerCase(), a, c: [...node.childNodes].map(ser).filter((x) => x !== null) };
}

export function snapshot(doc) {
  const lanes = doc.getElementById('lanes');
  return {
    lanesClass: lanes.className,
    lanes: [...lanes.children].map(ser),
    pressed: [...doc.querySelectorAll('.seg-btn')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.id),
    selectedCells: [...doc.querySelectorAll('button.cell.sel')].map((b) => b.id),
    selectedLanes: [...lanes.children].map((l, i) => (l.classList.contains('sel') ? i : -1)).filter((i) => i >= 0),
    budget: doc.getElementById('budget-label').textContent,
  };
}
