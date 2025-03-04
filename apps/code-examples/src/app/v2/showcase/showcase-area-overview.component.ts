import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyDocsHeadingAnchorService,
  SkyDocsTableOfContentsModule,
} from '@skyux/docs-tools';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [SkyDocsTableOfContentsModule],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-showcase-area-overview',
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
export class SkyShowcaseAreaOverviewComponent {}
