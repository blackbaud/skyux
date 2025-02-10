import { JsonPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import highlight from 'highlight.js/lib/core';
import hlJavascript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypescript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

import { StackBlitzLauncherService } from './stackblitz-launcher.service';

highlight.registerLanguage('html', hlXml);
highlight.registerLanguage('js', hlJavascript);
highlight.registerLanguage('scss', hlScss);
highlight.registerLanguage('ts', hlTypescript);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe, JsonPipe, NgComponentOutlet],
  selector: 'app-example-viewer',
  styles: `
    @import url('https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/default.min.css');

    :host {
      display: block;
      margin: 20px;
      padding: 20px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 10px;
    }

    pre {
      padding: 12px;
      border: 1px solid #ddd;
    }
  `,
  template: `
    <h2>{{ title() }}</h2>
    <div>
      <ng-template [ngComponentOutlet]="componentType()" />
    </div>
    <h3>Files</h3>
    @for (obj of files() | keyvalue; track obj.key) {
      <div>
        <h4>{{ obj.key }}</h4>
        <pre><code [innerHTML]="formatFileContents(obj.key, obj.value)"></code></pre>
      </div>
    }
    <p>
      <button type="button" (click)="openInStackBlitz()">
        Open in StackBlitz
      </button>
    </p>
  `,
})
export class ExampleViewerComponent {
  readonly #stackBlitzLauncher = inject(StackBlitzLauncherService);
  readonly #sanitizer = inject(DomSanitizer);

  public files = input.required<Record<string, string>>();
  public title = input.required<string>();
  public primaryFile = input.required<string>();
  public componentName = input.required<string>();
  public componentSelector = input.required<string>();
  public componentType = input.required<Type<unknown>>();

  protected formatFileContents(fileName: string, raw: string): SafeHtml {
    const formatted = highlight.highlight(raw, {
      language: fileName.split('.').pop() ?? 'html',
    });

    return this.#sanitizer.bypassSecurityTrustHtml(formatted.value);
  }

  protected openInStackBlitz(): void {
    void this.#stackBlitzLauncher.launch({
      componentImportPath: this.primaryFile(),
      componentName: this.componentName(),
      componentSelector: this.componentSelector(),
      files: this.files(),
      primaryFile: this.primaryFile(),
      title: this.title(),
    });
  }
}
