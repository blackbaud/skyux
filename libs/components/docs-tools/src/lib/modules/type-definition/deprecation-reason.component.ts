import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyDocsMarkdownHtmlDirective } from './markdown-html.directive';
import { SkyDocsMarkdownPipe } from './pipes/markdown.pipe';
import { SkyTypeAnchorLinksPipe } from './pipes/type-anchor-links.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDocsMarkdownHtmlDirective,
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
          [skyDocsMarkdownHtml]="
            message() | skyDocsMarkdown | skyTypeAnchorLinks
          "
        ></span>
      </sky-status-indicator>
    </p>
  `,
})
export class SkyDocsDeprecationReasonComponent {
  public readonly message = input.required<string>();
}
