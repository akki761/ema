/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/ (homepage snapshot gallery section)
 * Generated: 2026-09-02
 *
 * Cards convention: each subsequent row is a single card. The gallery source is
 * image-only (no title/description/CTA), so each card row holds only an image in
 * its first cell. decorate() detects the single-picture cell and marks it
 * card-image; no body cell is produced since there is no text content.
 *   Row 1: block name (added by createBlock)
 *   Row 2..N: [ image ]  (one per gallery item)
 */
export default function parse(element, { document }) {
  // Each direct child div is a gallery item wrapping a cover image
  const items = Array.from(element.querySelectorAll(':scope > div'));

  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = items.map((item) => {
    const img = item.querySelector('img');
    return [img || item];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
