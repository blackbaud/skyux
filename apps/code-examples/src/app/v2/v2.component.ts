import { JsonPipe, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
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
import * as EXAMPLES from '@skyux/code-examples';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyManifestDocumentationGroup,
  getDocumentationConfig,
  getDocumentationGroup,
} from '@skyux/manifest';

const DOCS = getDocumentationConfig();
const SEPARATOR = ':';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    JsonPipe,
    NgComponentOutlet,
    ReactiveFormsModule,
    SkyInputBoxModule,
  ],
  selector: 'app-code-examples-v2',
  template: `
    <form [formGroup]="formGroup">
      <sky-input-box labelText="Documentation group">
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
    @if (componentType()) {
      <div>
        <ng-template [ngComponentOutlet]="componentType()" />
      </div>
    }
    @if (data()) {
      <pre>{{ data() | json }}</pre>
    }
  `,
})
export default class CodeExamplesLandingComponent {
  #documentationGroupControl = new FormControl<string>('', {
    nonNullable: true,
  });

  protected componentType = signal<Type<unknown> | null>(null);
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

    this.componentType.set(EXAMPLES['PopoversDropdownBasicExampleComponent']);

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
