import { JsonPipe, NgComponentOutlet } from '@angular/common';
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
import { SkyIconModule } from '@skyux/icon';
import {
  type SkyManifestDocumentationGroup,
  getDocumentationConfig,
  getDocumentationGroup,
} from '@skyux/manifest';
import { SkyPageModule } from '@skyux/pages';

import { SkyShowcaseModule } from './showcase/showcase.module';

const DOCS = getDocumentationConfig();
const SEPARATOR = ' - ';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    JsonPipe,
    NgComponentOutlet,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyShowcaseModule,
    SkyIconModule,
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
        <sky-showcase [labelText]="selectedGroupName()" [manifest]="manifest">
          <sky-showcase-content category="development">
            <p>This content describes the development tab.</p>
          </sky-showcase-content>
        </sky-showcase>
        <pre>{{ manifest | json }}</pre>
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
  protected selectedGroupName = signal<string>('');

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

        this.selectedGroupName.set(groupName.replace(/-/g, ' '));
        this.data.set(getDocumentationGroup(packageName, groupName));
      });
  }
}
