import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  type SkyManifestDocumentationGroup,
  getDocumentationConfig,
  getDocumentationGroup,
} from '@skyux/manifest';
import { SkyPageModule } from '@skyux/pages';

import { SkyExampleViewerComponent } from './example-viewer/example-viewer.component';
import { SkyShowcaseModule } from './showcase/showcase.module';

const DOCS = getDocumentationConfig();
const SEPARATOR = ' - ';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgComponentOutlet,
    ReactiveFormsModule,
    SkyExampleViewerComponent,
    SkyInputBoxModule,
    SkyPageModule,
    SkyShowcaseModule,
  ],
  selector: 'app-code-examples-v2',
  styles: `
    :host {
      display: block;
      padding: 30px;
    }
  `,
  template: `
    <sky-page>
      <form [formGroup]="formGroup">
        <sky-input-box labelText="Documentation group" stacked>
          <select formControlName="documentationGroup">
            <option value="" selected>Select a documentation group...</option>
            @for (group of documentationGroups; track group) {
              <option [value]="group">
                {{ group }}
              </option>
            }
          </select>
        </sky-input-box>
      </form>

      @if (data(); as manifest) {
        <sky-showcase [manifest]="manifest">
          <sky-showcase-content category="development">
            This content describes the development tab.
          </sky-showcase-content>
        </sky-showcase>
      }
    </sky-page>
  `,
})
export default class CodeExamplesLandingComponent {
  #documentationGroupControl = new FormControl<string>('', {
    nonNullable: true,
  });

  protected data = signal<SkyManifestDocumentationGroup | undefined>(undefined);
  protected documentationGroups: string[] = [];
  protected formGroup = inject(FormBuilder).group({
    documentationGroup: this.#documentationGroupControl,
  });

  constructor() {
    for (const [packageName, config] of Object.entries(DOCS.packages)) {
      for (const group of Object.keys(config.groups)) {
        this.documentationGroups.push(`${packageName}${SEPARATOR}${group}`);
      }
    }

    this.documentationGroups.sort();

    this.#documentationGroupControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const parts = value.split(SEPARATOR);
        const packageName = parts[0];
        const groupName = parts[1];

        this.data.set(getDocumentationGroup(packageName, groupName));
      });
  }
}
