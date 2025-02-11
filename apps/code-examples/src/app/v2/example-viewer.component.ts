import { JsonPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
  inject,
  input,
  signal,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyBoxModule } from '@skyux/layout';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import {
  SkyCodeViewerComponent,
  SkyCodeViewerLanguage,
  assertCodeViewerLanguage,
} from './code-viewer.component';
import { StackBlitzLauncherService } from './stackblitz-launcher.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KeyValuePipe,
    JsonPipe,
    NgComponentOutlet,
    SkyBoxModule,
    SkyCodeViewerComponent,
    SkyIconModule,
    SkyVerticalTabsetModule,
  ],
  selector: 'sky-example-viewer',
  styleUrl: './example-viewer.component.scss',
  templateUrl: './example-viewer.component.html',
})
export class SkyExampleViewerComponent {
  readonly #stackBlitzLauncher = inject(StackBlitzLauncherService);

  public readonly componentName = input.required<string>();
  public readonly componentSelector = input.required<string>();
  public readonly componentType = input.required<Type<unknown>>();
  public readonly files = input.required<Record<string, string>>();
  public readonly primaryFile = input.required<string>();
  public readonly title = input.required<string>();

  protected readonly isCodeVisible = signal(false);

  protected getCodeLanguage(fileName: string): SkyCodeViewerLanguage {
    const extension = fileName.split('.').pop();
    assertCodeViewerLanguage(extension);
    return extension;
  }

  protected openInStackBlitz(): void {
    void this.#stackBlitzLauncher.launch({
      componentName: this.componentName(),
      componentSelector: this.componentSelector(),
      files: this.files(),
      primaryFile: this.primaryFile(),
      title: this.title(),
    });
  }

  protected toggleCodeVisibility(): void {
    const isCodeVisible = this.isCodeVisible();
    this.isCodeVisible.set(!isCodeVisible);
  }
}
