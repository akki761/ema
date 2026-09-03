import { createOptimizedPicture } from '../../scripts/aem.js';

const DATE_RE = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(,\s*\d{4})?$/;

/**
 * Split concatenated meta text like "Casual CoolMay 12" into
 * { category: "Casual Cool", date: "May 12" }.
 */
function splitMeta(text) {
  const trimmed = (text || '').trim();
  const match = trimmed.match(DATE_RE);
  if (!match) return { category: trimmed, date: '' };
  const date = match[0].trim();
  const category = trimmed.slice(0, trimmed.length - date.length).trim();
  return { category, date };
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';
        // Build the category pill + date meta row from the leading paragraph.
        const metaP = div.querySelector('p');
        if (metaP) {
          const { category, date } = splitMeta(metaP.textContent);
          const meta = document.createElement('div');
          meta.className = 'cards-article-meta';
          if (category) {
            const tag = document.createElement('span');
            tag.className = 'cards-article-tag';
            tag.textContent = category;
            meta.append(tag);
          }
          if (date) {
            const dateEl = document.createElement('span');
            dateEl.className = 'cards-article-date';
            dateEl.textContent = date;
            meta.append(dateEl);
          }
          metaP.replaceWith(meta);
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
