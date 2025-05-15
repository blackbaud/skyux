import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyDocsTableOfContentsModule } from '../table-of-contents/table-of-contents.module';

/**
 * Content for the "Highlight" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDocsTableOfContentsModule],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-highlight',
  styles: `
    :host {
      display: block;
      padding-top: var(--sky-padding-even-xl);
    }
  `,
  template: `<ng-content />`,
})
export class SkyDocsShowcaseAreaHighlightComponent {
  public headingText = input.required<string>();
}
