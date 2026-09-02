/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/ (homepage latest-articles section)
 * Generated: 2026-09-02
 *
 * Cards convention: 2 columns, each subsequent row is a card.
 *   Row 1: block name (added by createBlock)
 *   Row N: [ Image (first cell) , Text content (second cell): tag + date + linked heading ]
 * decorate() marks the single-picture cell as card-image and the other as
 * card-body. Each source card is an <a class="article-card"> wrapping an image
 * and a body (meta tag + date + h3); the article link is preserved on the heading.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, a.article-card'));

  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const href = card.getAttribute('href');
    const image = card.querySelector('img');
    const tag = card.querySelector('.tag');
    const date = card.querySelector('.article-card-meta .paragraph-sm, .paragraph-sm');
    const heading = card.querySelector('h3, h4, [class*="heading"]');

    const imageCell = image || '';

    const bodyCell = [];
    // Wrap tag and date in their own paragraphs so their text does not run
    // together (e.g. "Beach VibesFebruary 22") when serialized to markdown.
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      bodyCell.push(tagP);
    }
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      bodyCell.push(dateP);
    }
    if (heading) {
      if (href) {
        // Wrap the link INSIDE the heading (h3 > a) so md conversion keeps the
        // heading level and does not leak `###` into the link text.
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent;
        const wrapped = document.createElement(heading.tagName.toLowerCase());
        wrapped.append(link);
        bodyCell.push(wrapped);
      } else {
        bodyCell.push(heading);
      }
    } else if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = href;
      bodyCell.push(link);
    }

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
