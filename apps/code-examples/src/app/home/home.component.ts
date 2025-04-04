import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  SkyDocsHeadingAnchorModule,
  SkyDocsShowcaseModule,
} from '@skyux/docs-tools';
import { SkyInputBoxModule } from '@skyux/forms';
import { getDocumentationConfig } from '@skyux/manifest';
import { SkyPageModule } from '@skyux/pages';

const DOCS = getDocumentationConfig();
const SEPARATOR = ' | ';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyDocsShowcaseModule,
    SkyDocsHeadingAnchorModule,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  readonly #documentationGroupControl = new FormControl<string>('', {
    nonNullable: true,
  });

  readonly #value = toSignal(this.#documentationGroupControl.valueChanges);

  protected readonly groupName = computed(() => {
    const value = this.#value();
    const parts = value?.split(SEPARATOR);

    return parts?.[0];
  });

  protected readonly packageName = computed(() => {
    const value = this.#value();
    const parts = value?.split(SEPARATOR);

    return parts?.[1];
  });

  protected documentationGroups: string[] = [];

  protected formGroup = inject(FormBuilder).group({
    documentationGroup: this.#documentationGroupControl,
  });

  constructor() {
    for (const [packageName, config] of Object.entries(DOCS.packages)) {
      for (const group of Object.keys(config.groups)) {
        this.documentationGroups.push(`${group}${SEPARATOR}${packageName}`);
      }
    }

    this.documentationGroups.sort();

    this.#router.events.pipe(takeUntilDestroyed()).subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const queryParams = this.#router.parseUrl(evt.url).queryParamMap;

        this.#documentationGroupControl.setValue(
          queryParams.get('docsGroup') ?? '',
        );
      }
    });
  }

  protected onGroupChange(evt: Event): void {
    const docsGroup = (evt.target as HTMLSelectElement)?.value;

    if (docsGroup) {
      void this.#router.navigate([], {
        relativeTo: this.#activatedRoute,
        queryParams: { docsGroup },
        queryParamsHandling: 'merge',
      });
    } else {
      void this.#router.navigate([], {
        relativeTo: this.#activatedRoute,
      });
    }
  }
}
