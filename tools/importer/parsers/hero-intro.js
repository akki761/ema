/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://wknd-trendsetters.site/ (homepage hero-intro section)
 * Generated: 2026-09-02
 *
 * Hero convention: 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: Background Image (optional)
 *   Row 3: Title + Subheading + Call-to-Action
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));
  const images = Array.from(element.querySelectorAll('img.cover-image, img'));

  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: background image(s)
  if (images.length) cells.push([images]);

  // Row: content
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
