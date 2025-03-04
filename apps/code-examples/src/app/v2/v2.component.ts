import { JsonPipe } from '@angular/common';
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
import {
  SkyDocsHeadingAnchorModule,
  SkyDocsShowcaseModule,
} from '@skyux/docs-tools';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import {
  type SkyManifestDocumentationGroup,
  getDocumentationConfig,
  getDocumentationGroup,
} from '@skyux/manifest';
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
