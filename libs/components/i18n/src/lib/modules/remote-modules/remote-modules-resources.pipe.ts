import {
  ChangeDetectorRef,
  DestroyRef,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SkyRemoteModulesResourcesService } from './remote-modules-resources.service';

/**
 *
 */
@Pipe({
  name: 'skyRemoteModulesResources',
  pure: false,
})
export class SkyRemoteModulesResourcesPipe implements PipeTransform {
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #destroyRef = inject(DestroyRef);
  readonly #resourcesSvc = inject(SkyRemoteModulesResourcesService);

  #cache: Record<string, string> = {};

  public transform(resourceName: unknown, ...args: unknown[]): string {
    if (typeof resourceName === 'string') {
      const cacheKey = `${resourceName}_${JSON.stringify(args)}`;

      if (!(cacheKey in this.#cache)) {
        this.#resourcesSvc
          .getString(resourceName, ...args)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe((value) => {
            this.#cache[cacheKey] = value;
            this.#changeDetector.markForCheck();
          });
      }

      return this.#cache[cacheKey];
    }

    return '';
  }
}
