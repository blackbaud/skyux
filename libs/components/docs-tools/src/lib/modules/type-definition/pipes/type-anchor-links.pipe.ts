import {
  ChangeDetectorRef,
  DestroyRef,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SkyAppWindowRef, SkyLogService } from '@skyux/core';

import { SkyDocsTypeDefinitionAnchorIdsService } from '../type-anchor-ids.service';

const WORD_REGEXP = /\w+/g;

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
  readonly #anchorSvc = inject(SkyDocsTypeDefinitionAnchorIdsService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #destroyRef = inject(DestroyRef);
  readonly #logSvc = inject(SkyLogService);
  readonly #windowRef = inject(SkyAppWindowRef);

  readonly #cache: Record<string, { type: string; anchorEl: string }> = {};

  constructor() {
    this.#activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#refreshCache();
        this.#changeDetector.markForCheck();
      });
  }

  public transform(value: string, options?: { ignore: string[] }): string {
    const typeWrappedWithAnchor = value?.replace(WORD_REGEXP, (maybeType) => {
      if (options?.ignore.includes(maybeType)) {
        return maybeType;
      }

      const anchorId = this.#anchorSvc.getAnchorId(maybeType);

      if (anchorId) {
        if (!(anchorId in this.#cache)) {
          this.#saveToCache(anchorId, maybeType);
        }

        return this.#cache[anchorId].anchorEl;
      } else if (
        maybeType.toLowerCase().startsWith('sky') &&
        maybeType.length > 3 &&
        maybeType !== 'skyux'
      ) {
        this.#logSvc.error(
          `An anchorId could not be found that matches [[${maybeType}]]! (parsing: "${value}")`,
        );
      }

      return maybeType;
    });

    if (typeWrappedWithAnchor !== value) {
      return typeWrappedWithAnchor;
    }

    return value;
  }

  #refreshCache(): void {
    for (const anchorId in this.#cache) {
      this.#saveToCache(anchorId, this.#cache[anchorId].type);
    }
  }

  #saveToCache(anchorId: string, typeName: string): void {
    const href =
      this.#windowRef.nativeWindow.location.href.split('#')[0] + `#${anchorId}`;

    this.#cache[anchorId] = {
      type: typeName,
      anchorEl: `<a class="sky-docs-codespan-anchor" href="${href}">${typeName}</a>`,
    };
  }
}
