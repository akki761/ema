// Header / navigation block — content-first.
// Reads content/nav.plain.html (portable fragment), builds the header markup,
// wires mega-menu / dropdown hover + click, and the mobile hamburger drawer.
// No copy is hardcoded here; all labels/links come from the fragment.

const LOGO_SVG = '<svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"></path></svg>';

/**
 * Fetch the nav fragment (metadata-independent dual-fetch).
 * @returns {Promise<Document|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Build the brand / logo element from the first section. */
function buildBrand(sectionEl) {
  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  const link = sectionEl.querySelector('a');
  brand.href = link ? link.getAttribute('href') : '/';
  const icon = document.createElement('span');
  icon.className = 'nav-logo';
  icon.innerHTML = LOGO_SVG;
  const label = document.createElement('span');
  label.className = 'nav-brand-label';
  label.textContent = link ? link.textContent.trim() : 'Home';
  brand.append(icon, label);
  return brand;
}

/**
 * Build one top-level nav item. A source <li> with a nested <ul> is a
 * dropdown/mega-menu trigger; otherwise a plain link.
 */
function buildNavItem(li) {
  const item = document.createElement('li');
  item.className = 'nav-item';

  const topLink = li.querySelector(':scope > a');
  const subList = li.querySelector(':scope > ul');
  const featured = li.querySelector(':scope > p');

  if (subList) {
    item.classList.add('has-dropdown');
    const trigger = document.createElement('button');
    trigger.className = 'nav-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.textContent = topLink ? topLink.textContent.trim() : '';
    item.append(trigger);

    const panel = document.createElement('div');
    panel.className = 'nav-panel';
    if (featured) panel.classList.add('nav-panel-mega');

    const grid = document.createElement('ul');
    grid.className = 'nav-panel-list';
    subList.querySelectorAll(':scope > li').forEach((subLi) => {
      const subItem = document.createElement('li');
      const a = subLi.querySelector('a');
      if (a) {
        const desc = subLi.textContent.replace(a.textContent, '').trim();
        const na = document.createElement('a');
        na.href = a.getAttribute('href');
        na.innerHTML = `<span class="nav-panel-label">${a.textContent.trim()}</span>`;
        if (desc) na.innerHTML += `<span class="nav-panel-desc">${desc}</span>`;
        subItem.append(na);
      }
      grid.append(subItem);
    });
    panel.append(grid);

    if (featured) {
      const fa = featured.querySelector('a');
      const card = document.createElement('a');
      card.className = 'nav-panel-featured';
      card.href = fa ? fa.getAttribute('href') : '#';
      const fdesc = featured.textContent.replace(fa ? fa.textContent : '', '').trim();
      card.innerHTML = `<span class="nav-featured-title">${fa ? fa.textContent.trim() : ''}</span><span class="nav-featured-desc">${fdesc}</span>`;
      panel.append(card);
    }

    item.append(panel);
  } else if (topLink) {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = topLink.getAttribute('href');
    a.textContent = topLink.textContent.trim();
    item.append(a);
  }
  return item;
}

function closeAllPanels(navRoot) {
  navRoot.querySelectorAll('.nav-item.has-dropdown').forEach((it) => {
    it.classList.remove('open');
    const t = it.querySelector('.nav-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
}

export default async function decorate(block) {
  const doc = await fetchNav();
  block.textContent = '';
  if (!doc) return;

  const sections = [...doc.body.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';

  const [brandSection, menuSection, actionsSection] = sections;

  if (brandSection) wrapper.append(buildBrand(brandSection));

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const navEl = document.createElement('nav');
  navEl.className = 'nav-menu';
  const list = document.createElement('ul');
  list.className = 'nav-list';
  if (menuSection) {
    menuSection.querySelectorAll(':scope > ul > li').forEach((li) => {
      list.append(buildNavItem(li));
    });
  }
  navEl.append(list);

  if (actionsSection) {
    const cta = actionsSection.querySelector('a');
    if (cta) {
      const btn = document.createElement('a');
      btn.className = 'nav-cta';
      btn.href = cta.getAttribute('href');
      btn.textContent = cta.textContent.trim();
      navEl.append(btn);
    }
  }

  wrapper.append(navEl, hamburger);
  block.append(wrapper);

  // Desktop: hover opens dropdown/mega panel; click also toggles (touch/keyboard).
  list.querySelectorAll('.nav-item.has-dropdown').forEach((item) => {
    const trigger = item.querySelector('.nav-trigger');
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(min-width: 900px)').matches) {
        closeAllPanels(list);
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (window.matchMedia('(min-width: 900px)').matches) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      closeAllPanels(list);
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeAllPanels(list);
  });

  hamburger.addEventListener('click', () => {
    const open = wrapper.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  const mq = window.matchMedia('(min-width: 900px)');
  mq.addEventListener('change', () => {
    wrapper.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    closeAllPanels(list);
  });
}
