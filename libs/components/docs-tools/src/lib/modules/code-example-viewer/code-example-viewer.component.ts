import { KeyValuePipe, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyBoxModule } from '@skyux/layout';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import {
  type SkyDocsCodeHighlightLanguage,
  assertCodeHighlightLanguage,
} from '../code-highlight/code-highlight-language';
import { SkyDocsCodeSnippetModule } from '../code-snippet/code-snippet.module';
import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

import { SkyDocsStackBlitzService } from './stackblitz.service';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-margin-stacked-xl]': 'stacked()',
  },
  imports: [
    KeyValuePipe,
    NgComponentOutlet,
    SkyBoxModule,
    SkyDocsCodeSnippetModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyIdModule,
    SkyVerticalTabsetModule,
  ],
  selector: 'sky-docs-code-example-viewer',
  styleUrl: './code-example-viewer.component.scss',
  templateUrl: './code-example-viewer.component.html',
})
export class SkyDocsCodeExampleViewerComponent {
  readonly #stackblitzSvc = inject(SkyDocsStackBlitzService);

  public readonly componentName = input.required<string>();
  public readonly componentSelector = input.required<string>();
  public readonly componentType = input<Type<unknown> | undefined>();
  public readonly files = input.required<Record<string, string>>();
  public readonly headingText = input.required<string>();
  public readonly primaryFile = input.required<string>();

  public readonly demoHidden = input(false, { transform: booleanAttribute });
  public readonly stacked = input(false, { transform: booleanAttribute });

  protected readonly isCodeVisible = signal(false);

  protected getCodeLanguage(fileName: string): SkyDocsCodeHighlightLanguage {
    const extension = fileName.split('.').pop();
    assertCodeHighlightLanguage(extension);
    return extension;
  }

  protected launchStackBlitz(): void {
    void this.#stackblitzSvc.launch({
      componentName: this.componentName(),
      componentSelector: this.componentSelector(),
      files: this.files(),
      primaryFile: this.primaryFile(),
      title: this.headingText(),
    });
  }

  protected toggleCodeVisibility(): void {
    const isCodeVisible = this.isCodeVisible();
    this.isCodeVisible.set(!isCodeVisible);
  }
}
