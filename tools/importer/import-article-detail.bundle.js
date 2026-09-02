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

  // tools/importer/import-article-detail.js
  var import_article_detail_exports = {};
  __export(import_article_detail_exports, {
    default: () => import_article_detail_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document: document2 }) {
    const directDivs = Array.from(element.querySelectorAll(":scope > div"));
    const coverImage = element.querySelector("img.cover-image") || directDivs[0] && directDivs[0].querySelector("img");
    const imageDiv = directDivs.find((d) => d.querySelector("img"));
    const contentDiv = directDivs.find((d) => d !== imageDiv) || directDivs.find((d) => d.querySelector("h1, h2, .breadcrumbs, .tag"));
    const contentCell = [];
    if (contentDiv) {
      contentCell.push(...Array.from(contentDiv.children));
    } else {
      const breadcrumbs = element.querySelector(".breadcrumbs");
      const heading = element.querySelector('h1, h2, [class*="heading"]');
      const tag = element.querySelector(".tag");
      if (breadcrumbs) contentCell.push(breadcrumbs);
      if (heading) contentCell.push(heading);
      if (tag) contentCell.push(tag);
    }
    if (!coverImage && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (coverImage) cells.push([coverImage]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-spec.js
  function parse2(element, { document: document2 }) {
    const table = element.matches("table") ? element : element.querySelector("table");
    if (!table) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach((tr) => {
      const rowCells = Array.from(tr.children).map((cell) => {
        const kids = Array.from(cell.childNodes).filter(
          (n) => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()
        );
        if (kids.length === 0) return "";
        if (kids.length === 1 && kids[0].nodeType === Node.TEXT_NODE) {
          return kids[0].textContent.trim();
        }
        return kids;
      });
      if (rowCells.length) cells.push(rowCells);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "table-spec", cells });
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

  // tools/importer/import-article-detail.js
  var PAGE_TEMPLATE = {
    name: "article-detail",
    description: "Long-form article page with title hero, byline, and stacked rich-text body sections with inline images, lists, and a spec table",
    urls: [
      "https://wknd-trendsetters.site/blog/ace-pro-court-polo",
      "https://wknd-trendsetters.site/blog/fashion-blog-post",
      "https://wknd-trendsetters.site/blog/fashion-trends-young-culture",
      "https://wknd-trendsetters.site/blog/fashion-trends-young-style",
      "https://wknd-trendsetters.site/blog/flip-flop-summer-style",
      "https://wknd-trendsetters.site/blog/latest-trends-young-casual-fashion",
      "https://wknd-trendsetters.site/blog/street-style-trends"
    ],
    blocks: [
      {
        name: "hero-article",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout"]
      },
      {
        name: "table-spec",
        instances: [".blog-content table"]
      }
    ],
    sections: [
      { id: "rc1", name: "article-hero", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["hero-article"], defaultContent: [] },
      { id: "rc2", name: "article-body", selector: "#main-content > section.section:nth-of-type(2)", style: null, blocks: ["table-spec"], defaultContent: [".blog-content"] }
    ]
  };
  var parsers = {
    "hero-article": parse,
    "table-spec": parse2
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
  var import_article_detail_default = {
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
  return __toCommonJS(import_article_detail_exports);
})();
