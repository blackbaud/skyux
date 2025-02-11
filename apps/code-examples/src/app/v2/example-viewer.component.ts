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
  CodeViewerComponent,
  CodeViewerLanguage,
  assertCodeViewerLanguage,
} from './code-viewer.component';
import { StackBlitzLauncherService } from './stackblitz-launcher.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CodeViewerComponent,
    KeyValuePipe,
    JsonPipe,
    NgComponentOutlet,
    SkyBoxModule,
    SkyIconModule,
    SkyVerticalTabsetModule,
  ],
  selector: 'example-viewer',
  styles: `
    :host {
      display: block;
    }

    .example-viewer-demo-container {
      border-bottom: 1px solid var(--sky-border-color-neutral-medium);
    }
  `,
  template: `
    <sky-box
      class="sky-margin-stacked-xl"
      headingLevel="3"
      headingStyle="3"
      [headingText]="title()"
    >
      <sky-box-controls>
        @let ariaLabel = isCodeVisible() ? 'Hide code' : 'Show code';
        <button
          [attr.aria-label]="ariaLabel"
          [attr.title]="ariaLabel"
          class="sky-btn sky-btn-icon-borderless sky-margin-inline-sm"
          type="button"
          (click)="toggleCodeVisibility()"
        >
          <sky-icon icon="code" />
        </button>
        <button
          aria-label="Open code in StackBlitz"
          class="sky-btn sky-btn-icon-borderless"
          type="button"
          (click)="openInStackBlitz()"
        >
          <sky-icon icon="external-link" />
        </button>
      </sky-box-controls>

      <div class="example-viewer-demo-container sky-padding-even-xl">
        <ng-template [ngComponentOutlet]="componentType()" />
      </div>

      @if (isCodeVisible()) {
        <sky-box-content>
          <sky-vertical-tabset>
            @for (obj of files() | keyvalue; track obj.key) {
              <sky-vertical-tab
                [tabHeading]="obj.key"
                [active]="obj.key === primaryFile()"
              >
                <sky-code-viewer
                  [code]="obj.value"
                  [language]="getCodeLanguage(obj.key)"
                />
              </sky-vertical-tab>
            }
          </sky-vertical-tabset>
        </sky-box-content>
      }
    </sky-box>
  `,
})
export class ExampleViewerComponent {
  readonly #stackBlitzLauncher = inject(StackBlitzLauncherService);

  public componentName = input.required<string>();
  public componentSelector = input.required<string>();
  public componentType = input.required<Type<unknown>>();
  public files = input.required<Record<string, string>>();
  public primaryFile = input.required<string>();
  public title = input.required<string>();

  protected isCodeVisible = signal(false);

  protected getCodeLanguage(fileName: string): CodeViewerLanguage {
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
