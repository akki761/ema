/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-spec. Base block: table.
 * Source: https://wknd-trendsetters.site/blog/ace-pro-court-polo
 * Generated: 2026-09-02
 *
 * EDS "table" convention: multiple columns, multiple rows.
 *   Row 1: block name (added by WebImporter.Blocks.createBlock)
 *   Row 2: header row  -> Spec | Detail (table-spec.js renders the first data row as <th scope="column">)
 *   Rows 3..N: data     -> <strong>label</strong> | detail value
 * 2 columns throughout.
 */
export default function parse(element, { document }) {
  // The element itself is the <table> (selector: .blog-content table)
  const table = element.matches('table') ? element : element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const rows = Array.from(table.querySelectorAll('tr'));

  rows.forEach((tr) => {
    const rowCells = Array.from(tr.children).map((cell) => {
      // Preserve semantic inner markup (e.g. <strong> labels); fall back to trimmed text
      const kids = Array.from(cell.childNodes).filter(
        (n) => n.nodeType !== Node.TEXT_NODE || n.textContent.trim(),
      );
      if (kids.length === 0) return '';
      if (kids.length === 1 && kids[0].nodeType === Node.TEXT_NODE) {
        return kids[0].textContent.trim();
      }
      return kids;
    });
    if (rowCells.length) cells.push(rowCells);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-spec', cells });
  element.replaceWith(block);
}
