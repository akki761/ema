/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base block: columns.
 * Source selector: #main-content > section.section.secondary-section .grid-layout
 * Structure: two side-by-side columns —
 *   Column 1: intro (h2 "Let's connect" + descriptive paragraph)
 *   Column 2: contact groups (Email / Phone / Address — each a label + value)
 * Generated: 2026-09-02
 */
export default function parse(element, { document }) {
  // Top-level columns of the grid layout (direct children).
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Intro column: the div containing the main heading.
  const introCol = columns.find((c) => c.querySelector('h1, h2')) || columns[0];

  // Contact column: the div holding the contact items, or the next remaining column.
  const contactCol = element.querySelector('.contact-items')
    || columns.find((c) => c !== introCol);

  // Build the intro cell content (heading + paragraph).
  const introCell = [];
  if (introCol) {
    const heading = introCol.querySelector('h1, h2, h3, [class*="heading"]');
    if (heading) introCell.push(heading);
    introCol.querySelectorAll('p, [class*="paragraph"]').forEach((p) => introCell.push(p));
  }

  // Build the contact cell content (the label/value groups).
  const contactCell = [];
  if (contactCol) {
    // Prefer the inner grouped items; fall back to the column's own children.
    const groups = Array.from(contactCol.querySelectorAll(':scope > div'));
    if (groups.length) {
      groups.forEach((g) => contactCell.push(g));
    } else {
      Array.from(contactCol.childNodes).forEach((n) => contactCell.push(n));
    }
  }

  // Empty-block guard.
  if (!introCell.length && !contactCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row, two columns: intro | contact groups.
  cells.push([introCell, contactCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
