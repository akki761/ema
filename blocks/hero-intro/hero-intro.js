export default function decorate(block) {
  const rows = [...block.children];

  // Identify rows defensively: image cluster row vs. text/content row.
  const imageRow = rows.find((r) => r.querySelector('picture'));
  const textRow = rows.find((r) => r.querySelector('h1, h2, h3')
    || (!r.querySelector('picture') && r.querySelector('a')));

  if (imageRow && imageRow !== textRow) imageRow.classList.add('hero-intro-images');
  if (textRow) {
    textRow.classList.add('hero-intro-content');

    const cell = textRow.firstElementChild || textRow;

    // Standalone <p><a> CTAs are not auto-buttonized in this project
    // (only <strong>/<em> links are). Promote them to pill buttons and
    // group them so they sit side-by-side like the source.
    const ctas = [...cell.querySelectorAll(':scope > p')].filter((p) => {
      const a = p.firstElementChild;
      return p.children.length === 1
        && a && a.tagName === 'A'
        && p.textContent.trim() === a.textContent.trim();
    });

    if (ctas.length) {
      const group = document.createElement('div');
      group.className = 'button-group';
      ctas.forEach((p, i) => {
        const a = p.querySelector('a');
        a.classList.add('button', i === 0 ? 'primary' : 'secondary');
        group.append(a);
        p.remove();
      });
      cell.append(group);
    }
  }
}
