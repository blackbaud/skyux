import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyDocsClipboardModule } from '../clipboard/clipboard.module';
import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-margin-stacked-lg',
  },
  imports: [SkyDocsClipboardModule, SkyIconModule, SkyDocsToolsResourcesModule],
  selector: 'sky-docs-code-snippet-toolbar',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <button
      class="sky-btn sky-btn-default"
      type="button"
      skyDocsClipboardButton
      [clipboardTarget]="codeRef()"
      [copySuccessMessage]="
        'sky_docs_code_snippet_copy_to_clipboard_success_message'
          | skyLibResources
      "
    >
      <sky-icon iconName="clipboard-multiple" />
      {{
        'sky_docs_code_snippet_copy_to_clipboard_button_label' | skyLibResources
      }}
    </button>
  `,
})
export class SkyDocsCodeSnippetToolbarComponent {
  public readonly codeRef = input.required<HTMLElement>();
}
