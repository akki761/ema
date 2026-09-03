/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/ (homepage testimonial switcher section)
 * Generated: 2026-09-02
 *
 * The block is mapped to the single `.tabs-wrapper`, which contains:
 *   - `.tabs-content` with N `.tab-pane` grids (each: image + quote), and
 *   - a `.tab-menu` grid with N buttons (each: name + role).
 * The pane at index i corresponds to the menu button at index i.
 *
 * Tabs convention: 2 columns, one row per tab.
 *   Row 1: block name (added by createBlock)
 *   Row N: [ Tab Label = name + role , Tab Content = image + quote ]
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane'));
  const buttons = Array.from(element.querySelectorAll('.tab-menu-link, .tab-menu button, button'));

  const cells = [];
  const count = Math.max(panes.length, buttons.length);

  for (let i = 0; i < count; i += 1) {
    const pane = panes[i];
    const btn = buttons[i];

    // Label = name + role, sourced from the menu button (falls back to the pane).
    const labelSource = btn || pane;
    const labelCell = [];
    if (labelSource) {
      const strong = labelSource.querySelector('strong');
      const nameDiv = strong ? strong.closest('div') : null;
      const role = nameDiv && nameDiv.nextElementSibling ? nameDiv.nextElementSibling : null;
      if (nameDiv) labelCell.push(nameDiv);
      if (role) labelCell.push(role);
      if (labelCell.length === 0) labelCell.push(document.createTextNode(`Tab ${i + 1}`));
    }

    // Content = image + quote, sourced from the pane.
    const contentCell = [];
    if (pane) {
      const image = pane.querySelector('img');
      const quote = pane.querySelector('p.paragraph-xl, p');
      if (image) contentCell.push(image);
      if (quote) contentCell.push(quote);
    }

    cells.push([labelCell, contentCell]);
  }

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
