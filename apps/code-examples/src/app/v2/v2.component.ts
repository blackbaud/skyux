import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyDocsHeadingAnchorModule,
  SkyDocsShowcaseModule,
} from '@skyux/docs-tools';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { getDocumentationConfig } from '@skyux/manifest';
import { SkyPageModule } from '@skyux/pages';

const DOCS = getDocumentationConfig();
const SEPARATOR = ' | ';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    JsonPipe,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyDocsShowcaseModule,
    SkyIconModule,
    SkyDocsHeadingAnchorModule,
  ],
  selector: 'app-code-examples-v2',
  styles: `
    :host {
      display: block;
      padding: 30px;
    }
  `,
  templateUrl: './v2.component.html',
})
export default class CodeExamplesLandingComponent {
  readonly #documentationGroupControl = new FormControl<string>('', {
    nonNullable: true,
  });

  readonly #value = toSignal(this.#documentationGroupControl.valueChanges);

  protected readonly groupName = computed(() => {
    const value = this.#value();
    const parts = value?.split(SEPARATOR);

    return parts?.[1];
  });

  protected readonly packageName = computed(() => {
    const value = this.#value();
    const parts = value?.split(SEPARATOR);

    return parts?.[0];
  });

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
  }
}
