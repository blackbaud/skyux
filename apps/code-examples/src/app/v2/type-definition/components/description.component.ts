import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyEscapeHtmlPipe } from '../pipes/escape-html.pipe';
import { SkyMarkdownPipe } from '../pipes/markdown.pipe';
import { SkyTypeAnchorLinksPipe } from '../pipes/type-anchor-links.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyEscapeHtmlPipe,
    SkyMarkdownPipe,
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
          | skyEscapeHtml
          | skyMarkdown: 'block'
          | skyTypeAnchorLinks: { ignore: [definitionName()] }
      "
    ></div>
  `,
})
export class SkyDocsTypeDefinitionDescriptionComponent {
  public readonly description = input.required<string>();
  public readonly definitionName = input.required<string>();
}
