/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd-trendsetters.site/ (homepage CTA banner section)
 * Generated: 2026-09-02
 *
 * Hero convention: 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: Background Image (optional)
 *   Row 3: Title + Subheading + Call-to-Action
 * decorate() treats a picture in the first child as an absolutely-positioned
 * background and renders the rest as overlay content. Source is a card with an
 * overlay image + card-body (h2 + p + button).
 */
export default function parse(element, { document }) {
  const image = element.querySelector('img.cover-image, img');
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  if (!heading && !subheading && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: background image
  if (image) cells.push([image]);

  // Row: content
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
