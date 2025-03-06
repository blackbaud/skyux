import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyDocsEscapeHtmlPipe } from './pipes/escape-html.pipe';
import { SkyDocsMarkdownPipe } from './pipes/markdown.pipe';
import { SkyTypeAnchorLinksPipe } from './pipes/type-anchor-links.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDocsEscapeHtmlPipe,
    SkyDocsMarkdownPipe,
    SkyStatusIndicatorModule,
    SkyTypeAnchorLinksPipe,
  ],
  selector: 'sky-docs-type-definition-description',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <div
      [innerHTML]="
        description()
          | skyDocsEscapeHtml
          | skyDocsMarkdown: 'block'
          | skyTypeAnchorLinks: { ignore: [definitionName()] }
      "
    ></div>
  `,
})
export class SkyDocsTypeDefinitionDescriptionComponent {
  public readonly definitionName = input.required<string>();
  public readonly description = input.required<string>();
}
