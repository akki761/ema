/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/ (homepage FAQ section)
 * Generated: 2026-09-02
 *
 * Accordion convention: 2 columns, each subsequent row is an accordion item.
 *   Row 1: block name (added by createBlock)
 *   Row N: [ Title cell (question) , Content cell (answer) ]
 * decorate() wraps row.children[0] in a <summary> and row.children[1] as the
 * body, building a <details> per row. Source items are <details.faq-item> with a
 * <summary.faq-question> (question text in a span) and a <div.faq-answer> body.
 * The section heading/subheading are separate default content, not part of the block.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('details.faq-item, .faq-item'));

  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const summary = item.querySelector('summary.faq-question, summary');
    // Question text: the <span> label (avoid pulling in the toggle icon <img>)
    const question = summary
      ? (summary.querySelector('span') || summary)
      : null;
    const answer = item.querySelector('.faq-answer, div');

    const questionCell = question ? question.cloneNode(true) : '';
    const answerCell = answer || '';

    cells.push([questionCell, answerCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
