import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

import { SkyDocsCodeSnippetToolbarComponent } from './code-snippet-toolbar.component';

/**
 * Used to wrap a content child `code` element.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.sky-margin-stacked-lg]': 'stacked()',
    '[class.sky-elevation-0-bordered]': 'bordered()',
    '[class.sky-padding-even-xl]': 'bordered()',
    '[class.sky-rounded-corners]': 'bordered()',
  },
  imports: [SkyDocsCodeSnippetToolbarComponent],
  selector: 'sky-docs-code-snippet:not([code])',
  styleUrls: [
    './code-snippet.component.scss',
    './themes/vscode-modern-light.scss',
  ],
  template: `
    @if (!hideToolbar()) {
      <sky-docs-code-snippet-toolbar [codeRef]="codeRef" />
    }
    <pre #codeRef><ng-content select="code" /></pre>
  `,
})
export class SkyDocsCodeSnippetWrapperComponent {
  public readonly bordered = input(false, { transform: booleanAttribute });
  public readonly hideToolbar = input(false, { transform: booleanAttribute });
  public readonly stacked = input(false, { transform: booleanAttribute });
}
