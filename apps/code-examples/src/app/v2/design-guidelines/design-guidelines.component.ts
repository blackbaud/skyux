import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-docs-design-guidelines',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `<ng-content />`,
})
export class SkyDocsDesignGuidelinesComponent {}
// TODO: Don't use this. Just use the "additional content" component?

/**
 * Automatically adds heading anchors.
 *
 * <sky-docs-showcase-content area="development">
 *
 *   TODO: Maybe create a `sky-docs-demo-page-section` component native to the docs SPA that does the following?
 *
 *   <sky-docs-heading-anchor headingText="Usage" headingId="section-usage" headingLevel="2" />
 *
 *   <p>Hello, from the development tab.</p>
 *
 *   <sky-docs-design-guideline headingText="">
 *
 *   </sky-docs-design-guideline>
 *
 *
 * </sky-docs-showcase-content>
 *
 *
 *
 *
 *
 */
