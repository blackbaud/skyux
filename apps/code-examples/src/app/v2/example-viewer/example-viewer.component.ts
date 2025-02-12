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
  type SkyCodeSnippetLanguage,
  assertCodeSnippetLanguage,
} from '../code-snippet/code-snippet-language';
import { SkyCodeSnippetComponent } from '../code-snippet/code-snippet.component';
import { StackBlitzLauncherService } from '../stackblitz/stackblitz-launcher.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KeyValuePipe,
    JsonPipe,
    NgComponentOutlet,
    SkyBoxModule,
    SkyCodeSnippetComponent,
    SkyIconModule,
    SkyVerticalTabsetModule,
  ],
  selector: 'sky-example-viewer',
  styles: `
    :host {
      display: block;
    }

    .sky-example-viewer-code-container {
      border-top: 1px solid var(--sky-border-color-neutral-medium);
    }
  `,
  template: `<sky-box
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
        <sky-icon iconName="code" />
      </button>
      <button
        aria-label="Open code in StackBlitz"
        class="sky-btn sky-btn-icon-borderless"
        type="button"
        (click)="openInStackBlitz()"
      >
        <sky-icon iconName="open" />
      </button>
    </sky-box-controls>

    <div class="sky-padding-even-xl">
      @if (!demoHidden()) {
        <ng-template [ngComponentOutlet]="componentType()" />
      } @else {
        Open this code example in StackBlitz to view the demo.
      }
    </div>

    @if (isCodeVisible()) {
      <div class="sky-example-viewer-code-container">
        <sky-vertical-tabset>
          @for (obj of files() | keyvalue; track obj.key) {
            <sky-vertical-tab
              [tabHeading]="obj.key"
              [active]="obj.key === primaryFile()"
            >
              <sky-code-snippet
                [code]="obj.value"
                [language]="getCodeLanguage(obj.key)"
              />
            </sky-vertical-tab>
          }
        </sky-vertical-tabset>
      </div>
    }
  </sky-box> `,
})
export class SkyExampleViewerComponent {
  readonly #stackBlitzLauncher = inject(StackBlitzLauncherService);

  public readonly componentName = input.required<string>();
  public readonly componentSelector = input.required<string>();
  public readonly componentType = input.required<Type<unknown>>();
  public readonly demoHidden = input<boolean>(true);
  public readonly files = input.required<Record<string, string>>();
  public readonly primaryFile = input.required<string>();
  public readonly title = input.required<string>();

  protected readonly isCodeVisible = signal(false);

  protected getCodeLanguage(fileName: string): SkyCodeSnippetLanguage {
    const extension = fileName.split('.').pop();
    assertCodeSnippetLanguage(extension);
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
