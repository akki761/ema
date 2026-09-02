/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const images = Array.from(element.querySelectorAll("img.cover-image, img"));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (images.length) cells.push([images]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > div"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = items.map((item) => {
      const img = item.querySelector("img");
      return [img || item];
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tab-pane"));
    const buttons = Array.from(element.querySelectorAll(".tab-menu-link, .tab-menu button, button"));
    const cells = [];
    const count = Math.max(panes.length, buttons.length);
    for (let i = 0; i < count; i += 1) {
      const pane = panes[i];
      const btn = buttons[i];
      const labelSource = btn || pane;
      const labelCell = [];
      if (labelSource) {
        const strong = labelSource.querySelector("strong");
        const nameDiv = strong ? strong.closest("div") : null;
        const role = nameDiv && nameDiv.nextElementSibling ? nameDiv.nextElementSibling : null;
        if (nameDiv) labelCell.push(nameDiv);
        if (role) labelCell.push(role);
        if (labelCell.length === 0) labelCell.push(document2.createTextNode(`Tab ${i + 1}`));
      }
      const contentCell = [];
      if (pane) {
        const image = pane.querySelector("img");
        const quote = pane.querySelector("p.paragraph-xl, p");
        if (image) contentCell.push(image);
        if (quote) contentCell.push(quote);
      }
      cells.push([labelCell, contentCell]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, a.article-card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const href = card.getAttribute("href");
      const image = card.querySelector("img");
      const tag = card.querySelector(".tag");
      const date = card.querySelector(".article-card-meta .paragraph-sm, .paragraph-sm");
      const heading = card.querySelector('h3, h4, [class*="heading"]');
      const imageCell = image || "";
      const bodyCell = [];
      if (tag) bodyCell.push(tag);
      if (date) bodyCell.push(date);
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent;
          const wrapped = document2.createElement(heading.tagName.toLowerCase());
          wrapped.append(link);
          bodyCell.push(wrapped);
        } else {
          bodyCell.push(heading);
        }
      } else if (href) {
        const link = document2.createElement("a");
        link.setAttribute("href", href);
        link.textContent = href;
        bodyCell.push(link);
      }
      cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll("details.faq-item, .faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      const question = summary ? summary.querySelector("span") || summary : null;
      const answer = item.querySelector(".faq-answer, div");
      const questionCell = question ? question.cloneNode(true) : "";
      const answerCell = answer || "";
      cells.push([questionCell, answerCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const image = element.querySelector("img.cover-image, img");
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // <a href="#main-content" class="skip-link"> at top of body
        ".navbar",
        // header shell: logo, .nav-menu, .mega-menu, .nav-menu-dropdown, mobile toggle
        "footer.footer"
        // dark inverse footer: logo, .footer-icons-group, footer nav columns
      ]);
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Landing page with hero, image gallery grid, testimonial/quote block, article card row, FAQ accordion, and full-width CTA banner",
    urls: [
      "https://wknd-trendsetters.site/",
      "https://wknd-trendsetters.site/fashion-trends-of-the-season",
      "https://wknd-trendsetters.site/fashion-trends-young-adults"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["#main-content > header.section.secondary-section .grid-layout"]
      },
      {
        name: "columns-feature",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) .grid-layout"]
      },
      {
        name: "hero-banner",
        instances: ["#main-content > section.section.inverse-section .grid-layout"]
      }
    ],
    sections: [
      { id: "rc1", name: "hero-intro-section", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["hero-intro"], defaultContent: [] },
      { id: "rc2", name: "case-study-teaser", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc3", name: "snapshot-gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center"] },
      { id: "rc4", name: "testimonial-switcher", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "rc5", name: "latest-articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center"] },
      { id: "rc6", name: "faq", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: ["#main-content > section.section:nth-of-type(5) .utility-text-align-center"] },
      { id: "rc7", name: "cta-banner", selector: "#main-content > section.section.inverse-section", style: null, blocks: ["hero-banner"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "columns-feature": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
