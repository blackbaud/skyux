import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyDocsTableOfContentsModule } from '../table-of-contents/table-of-contents.module';

/**
 * Content for the "Overview" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [SkyDocsTableOfContentsModule],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-overview',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-docs-toc-page menuHeadingText="Overview">
      <ng-content />
    </sky-docs-toc-page>
  `,
})
export class SkyDocsShowcaseAreaOverviewComponent {}
