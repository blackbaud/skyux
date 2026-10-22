import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyThemeModule } from '@skyux/theme';

import { SkyDocsClipboardModule } from '../clipboard/clipboard.module';
import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDocsClipboardModule,
    SkyDocsToolsResourcesModule,
    SkyToolbarModule,
    SkyButton,
    SkyThemeModule,
  ],
  selector: 'sky-docs-code-snippet-toolbar',
  styles: `
    :host {
      display: block;
    }

    .copy-toolbar {
      display: block;
    }
  `,
  template: `
    <sky-toolbar
      class="copy-toolbar"
      [skyThemeClass]="{ 'sky-margin-stacked-lg': 'default' }"
    >
      <sky-toolbar-item>
        <sky-button
          buttonStyle="default"
          iconName="clipboard-multiple"
          skyDocsClipboardButton
          [labelText]="
            'sky_docs_code_snippet_copy_to_clipboard_button_label'
              | skyLibResources
          "
          [clipboardTarget]="codeRef()"
          [copySuccessMessage]="
            'sky_docs_code_snippet_copy_to_clipboard_success_message'
              | skyLibResources
          "
        />
      </sky-toolbar-item>
    </sky-toolbar>
  `,
})
export class SkyDocsCodeSnippetToolbarComponent {
  public readonly codeRef = input.required<HTMLElement>();
}
