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
import { SkyIconModule } from '@skyux/icon';
import { SkyBoxModule } from '@skyux/layout';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import {
  type SkyCodeSnippetLanguage,
  assertCodeSnippetLanguage,
} from '../code-snippet/code-snippet-language';
import { SkyCodeSnippetModule } from '../code-snippet/code-snippet.module';

import { StackBlitzService } from './stackblitz.service';

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
    SkyCodeSnippetModule,
    SkyIconModule,
    SkyVerticalTabsetModule,
  ],
  selector: 'sky-example-viewer',
  styleUrl: './example-viewer.component.scss',
  templateUrl: './example-viewer.component.html',
})
export class SkyExampleViewerComponent {
  readonly #stackblitzSvc = inject(StackBlitzService);

  public readonly componentName = input.required<string>();
  public readonly componentSelector = input.required<string>();
  public readonly componentType = input.required<Type<unknown>>();
  public readonly demoHidden = input<boolean>(true);
  public readonly files = input.required<Record<string, string>>();
  public readonly primaryFile = input.required<string>();
  public readonly stacked = input(false, { transform: booleanAttribute });
  public readonly headingText = input.required<string>();

  protected readonly isCodeVisible = signal(false);

  protected getCodeLanguage(fileName: string): SkyCodeSnippetLanguage {
    const extension = fileName.split('.').pop();
    assertCodeSnippetLanguage(extension);
    return extension;
  }

  protected openInStackBlitz(): void {
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
