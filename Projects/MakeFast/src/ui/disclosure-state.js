/** In-memory state for native <details> menus during a same-view refresh.
 * Do not store these values in localStorage or carry them to another person/view.
 */
function disclosureKey(el, index) {
  if (el.dataset.disclosureId) return `id:${el.dataset.disclosureId}`;
  const summary = el.querySelector(':scope > summary');
  const label = summary?.firstElementChild?.textContent || summary?.textContent || '';
  return `summary:${label.trim().replace(/\s+/g, ' ').toLowerCase()}:${index}`;
}

export function captureDisclosureState(container) {
  if (!container) return null;
  const details = [...container.querySelectorAll('details')];
  return {
    scrollTop: container.scrollTop,
    scrollLeft: container.scrollLeft,
    folds: details.map((el, i) => [disclosureKey(el, i), el.open]),
  };
}

export function restoreDisclosureState(container, snapshot) {
  if (!container || !snapshot) return;
  const folds = new Map(snapshot.folds);
  [...container.querySelectorAll('details')].forEach((el, i) => {
    const key = disclosureKey(el, i);
    if (folds.has(key)) el.open = folds.get(key);
  });
  container.scrollTop = snapshot.scrollTop;
  container.scrollLeft = snapshot.scrollLeft;
}
