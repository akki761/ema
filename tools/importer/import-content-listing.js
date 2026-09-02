/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (reused from homepage migration)
import heroIntroParser from './parsers/hero-intro.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'content-listing',
  description: 'Listing index page with intro hero and a grid of article/case-study cards',
  urls: [
    'https://wknd-trendsetters.site/blog',
    'https://wknd-trendsetters.site/case-studies',
    'https://wknd-trendsetters.site/fashion-insights',
  ],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['#main-content > header.section.secondary-section .grid-layout'],
    },
    {
      name: 'columns-feature',
      instances: ['#main-content > section.section:nth-of-type(1) .grid-layout'],
    },
    {
      name: 'cards-article',
      instances: ['#articles .grid-layout.desktop-4-column'],
    },
    {
      name: 'cards-gallery',
      instances: [
        '#main-content > section.section:nth-of-type(3) .grid-layout.desktop-3-column',
        '#main-content > section.section.secondary-section .grid-layout.desktop-4-column.grid-gap-sm',
      ],
    },
    {
      name: 'tabs-testimonial',
      instances: ['#cases .tabs-wrapper'],
    },
    {
      name: 'hero-banner',
      instances: ['#main-content > section.section.inverse-section .grid-layout'],
    },
  ],
  sections: [
    { id: 'rc1', name: 'intro-hero', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['hero-intro'], defaultContent: [] },
    { id: 'rc2', name: 'featured-teaser', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc3', name: 'latest-articles', selector: '#articles', style: 'secondary', blocks: ['cards-article'], defaultContent: ['#articles .utility-text-align-center'] },
    { id: 'rc5', name: 'snapshot-gallery', selector: '#main-content > section.section:nth-of-type(3)', style: null, blocks: ['cards-gallery'], defaultContent: ['#main-content > section.section:nth-of-type(3) .utility-text-align-center'] },
    { id: 'rc6', name: 'testimonials', selector: '#cases', style: null, blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 'rc7', name: 'cta-banner-inverse', selector: '#main-content > section.section.inverse-section', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'rc4', name: 'cta-banner', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section .utility-text-align-center'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'columns-feature': columnsFeatureParser,
  'cards-article': cardsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY - cleanup first, sections after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
