/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-trend. Base: cards.
 * Source: WKND Trendsetters trends-landing template (#trends .grid-layout.desktop-4-column)
 * Generated: 2026-09-02
 *
 * Cards convention: 2 columns, each subsequent row is a card.
 *   Row 1: block name (added by createBlock)
 *   Row N: [ Image (first cell) , Text content (second cell): tag + linked heading + description ]
 * blocks/cards-trend/cards-trend.js marks the single-picture cell as
 * cards-trend-card-image and the other as cards-trend-card-body.
 * Each source card is an <a class="trend-card card-link"> wrapping
 * .trend-card-image (img) and .trend-card-body (span.tag + h3 + p).
 * There is NO date. The card link is preserved on the heading.
 */
export default function parse(element, { document }) {
  // Iterate DIRECT children rather than relying on a `:scope >` selector, which
  // can behave inconsistently across DOM implementations. Each card is a direct
  // child <a> (class "trend-card card-link"); fall back to any descendant card
  // anchor only if there are no direct-child anchors.
  let cards = Array.from(element.children).filter(
    (c) => c.tagName === 'A' && (c.classList.contains('trend-card') || c.classList.contains('card-link')),
  );
  if (cards.length === 0) {
    cards = Array.from(element.children).filter((c) => c.tagName === 'A');
  }
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('a.trend-card'));
  }

  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const href = card.getAttribute('href');
    const image = card.querySelector('.trend-card-image img, img');
    const tag = card.querySelector('.tag, [class*="tag"]');
    const heading = card.querySelector('h3, h4, [class*="heading"]');
    const description = card.querySelector('.trend-card-body p, p');

    // Clone the image so moving it into the block table cannot detach the live
    // node and disturb iteration over the remaining sibling cards.
    const imageCell = image ? image.cloneNode(true) : '';

    const bodyCell = [];
    // Wrap the tag label in its own paragraph so it does not run together with
    // following text when serialized to markdown.
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      bodyCell.push(tagP);
    }
    if (heading) {
      const link = document.createElement('a');
      if (href) link.setAttribute('href', href);
      link.textContent = heading.textContent.trim();
      // Wrap the link INSIDE the heading (h3 > a) so md conversion keeps the
      // heading level and does not leak `###` into the link text.
      const wrapped = document.createElement(heading.tagName.toLowerCase());
      wrapped.append(href ? link : document.createTextNode(heading.textContent.trim()));
      bodyCell.push(wrapped);
    }
    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      bodyCell.push(descP);
    }

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-trend', cells });
  element.replaceWith(block);
}
