import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyDocsMarkdownPipe } from './pipes/markdown.pipe';
import { SkyTypeAnchorLinksPipe } from './pipes/type-anchor-links.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDocsMarkdownPipe,
    SkyStatusIndicatorModule,
    SkyTypeAnchorLinksPipe,
  ],
  selector: 'sky-docs-deprecation-reason',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <p>
      <sky-status-indicator descriptionType="warning" indicatorType="warning">
        <strong class="sky-font-emphasized">Deprecated. </strong
        ><span
          [innerHTML]="message() | skyDocsMarkdown | skyTypeAnchorLinks"
        ></span>
      </sky-status-indicator>
    </p>
  `,
})
export class SkyDocsDeprecationReasonComponent {
  public readonly message = input.required<string>();
}
