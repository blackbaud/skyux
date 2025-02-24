import {
  ChangeDetectorRef,
  DestroyRef,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';

import { SkyAnchorIdService } from './anchor-id.service';

const NOT_WORD_REGEXP = /\w+/g;

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsAnchorId',
  pure: false,
})
export class SkyDocsAnchorLinkPipe implements PipeTransform {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #anchorSvc = inject(SkyAnchorIdService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #destroyRef = inject(DestroyRef);

  readonly #cache: Record<string, string> = {};
  readonly #currentRoute = this.#activatedRoute.snapshot.url.toString();

  public transform(value: string): string | undefined {
    const typeWrappedWithAnchor = value?.replace(
      NOT_WORD_REGEXP,
      (maybeType) => {
        const anchorId = this.#anchorSvc.getAnchorId(maybeType);

        if (anchorId) {
          if (!(value in this.#cache)) {
            this.#activatedRoute.queryParams
              .pipe(takeUntilDestroyed(this.#destroyRef))
              .subscribe((queryParams) => {
                const href = this.#getHref(anchorId, queryParams);

                this.#cache[value] =
                  `<a class="sky-docs-codespan-anchor" href="${href}">${maybeType}</a>`;

                this.#changeDetector.markForCheck();
              });
          }

          return this.#cache[value];
        }

        return maybeType;
      },
    );

    if (typeWrappedWithAnchor !== value) {
      return typeWrappedWithAnchor;
    }

    return value;
  }

  #getHref(anchorId: string, queryParams: Params): string {
    const params = Object.entries(queryParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return `${this.#currentRoute}${params.length > 0 ? `?${params}` : ''}#${anchorId}`;
  }
}
