/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article. Base block: hero.
 * Source: https://wknd-trendsetters.site/blog/ace-pro-court-polo
 * Generated: 2026-09-02
 *
 * EDS "hero" convention: 1 column, 3 rows.
 *   Row 1: block name (added by WebImporter.Blocks.createBlock)
 *   Row 2: Background Image (optional)  -> hero-article.js reads :scope > div:first-child picture
 *   Row 3: Title + Subheading + CTA     -> here: breadcrumb + H1 headline + byline/date + category tag
 */
export default function parse(element, { document }) {
  // Direct column divs of the grid-layout: one holds the cover image, the other the text content
  const directDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Cover image (validated in source: img.cover-image inside first div)
  const coverImage = element.querySelector('img.cover-image')
    || (directDivs[0] && directDivs[0].querySelector('img'));

  // Content div is the one that is not the image column
  const imageDiv = directDivs.find((d) => d.querySelector('img'));
  const contentDiv = directDivs.find((d) => d !== imageDiv)
    || directDivs.find((d) => d.querySelector('h1, h2, .breadcrumbs, .tag'));

  // Build the single content cell: breadcrumbs, headline, byline/date wrapper, category tag
  const contentCell = [];
  if (contentDiv) {
    // Preserve semantic children (breadcrumb div, h1, byline wrapper, tag) as-is
    contentCell.push(...Array.from(contentDiv.children));
  } else {
    // Fallback: pull the recognisable pieces individually
    const breadcrumbs = element.querySelector('.breadcrumbs');
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const tag = element.querySelector('.tag');
    if (breadcrumbs) contentCell.push(breadcrumbs);
    if (heading) contentCell.push(heading);
    if (tag) contentCell.push(tag);
  }

  // Empty-block guard
  if (!coverImage && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: Background image (optional) — one column, one cell
  if (coverImage) cells.push([coverImage]);
  // Row 3: content — one column, one cell holding all elements
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
