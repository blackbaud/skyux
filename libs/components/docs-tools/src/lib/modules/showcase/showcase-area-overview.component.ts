import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyDocsTableOfContentsModule } from '../table-of-contents/table-of-contents.module';

/**
 * Content for the "Overview" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDocsTableOfContentsModule],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-overview',
  styles: `
    :host {
      display: block;
      padding-top: var(--sky-padding-even-xl);
    }
  `,
  template: `
    <sky-docs-toc-page menuHeadingText="Overview">
      <ng-content />
    </sky-docs-toc-page>
  `,
})
export class SkyDocsShowcaseAreaOverviewComponent {}
