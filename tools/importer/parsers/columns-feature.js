/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://wknd-trendsetters.site/ (homepage case-study teaser section)
 * Generated: 2026-09-02
 *
 * Columns convention: multiple columns/rows; row 1 is block name.
 * decorate() reads block.firstElementChild.children as the columns of the row.
 * Source has one content row with 2 columns:
 *   [ image ] | [ breadcrumbs + heading + byline ]
 */
export default function parse(element, { document }) {
  // The grid's direct child divs are the visual columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row: one cell per column
  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
