import {
  ChangeDetectorRef,
  DestroyRef,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';

import { SkyTypeAnchorIdsService } from './type-anchor-ids.service';

const NOT_WORD_REGEXP = /\w+/g;

/**
 * For the given string, finds known tokens and wraps them in an anchor linking to the respective element ID.
 * @internal
 */
@Pipe({
  name: 'skyTypeAnchorLinks',
  pure: false,
})
export class SkyTypeAnchorLinksPipe implements PipeTransform {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #anchorSvc = inject(SkyTypeAnchorIdsService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #destroyRef = inject(DestroyRef);

  readonly #cache: Record<string, string> = {};
  readonly #currentRoute = this.#activatedRoute.snapshot.url.toString();

  public transform(value: string, options?: { ignore: string[] }): string {
    const typeWrappedWithAnchor = value?.replace(
      NOT_WORD_REGEXP,
      (maybeType) => {
        if (options?.ignore.includes(maybeType)) {
          return maybeType;
        }

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
