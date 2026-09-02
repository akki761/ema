/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome from the Astro-generated markup so the
 * import contains only page-level authorable content. All selectors below were
 * verified against migration-work/cleaned.html.
 *
 * Non-authorable chrome removed:
 *  - <a class="skip-link">           accessibility "Skip to main content" link (body top)
 *  - div.navbar                       header + .mega-menu / .nav-menu-dropdown; becomes a global nav block, not page content
 *  - footer.footer                    dark inverse footer (logo, social icons, footer nav columns); becomes a global footer block
 *  - .breadcrumbs                     breadcrumb navigation nested inside the case-study teaser section (non-authorable nav)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Site shell chrome handled as global blocks (header/nav + footer) and a11y skip link.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',   // <a href="#main-content" class="skip-link"> at top of body
      '.navbar',      // header shell: logo, .nav-menu, .mega-menu, .nav-menu-dropdown, mobile toggle
      'footer.footer', // dark inverse footer: logo, .footer-icons-group, footer nav columns
    ]);

    // In-content non-authorable navigation: breadcrumbs inside the case-study teaser section.
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }
}
