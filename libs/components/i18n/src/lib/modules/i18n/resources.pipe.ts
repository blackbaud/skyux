import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAppResourcesService } from './resources.service';

/**
 * An Angular pipe for displaying a resource string.
 */
@Pipe({
  name: 'skyAppResources',
  pure: false,
  standalone: false,
})
export class SkyAppResourcesPipe implements PipeTransform, OnDestroy {
  #ngUnsubscribe = new Subject<void>();

  #resourceCache: Record<string, any> = {};

  #changeDetector: ChangeDetectorRef;
  #resourcesSvc: SkyAppResourcesService;

  constructor(
    changeDetector: ChangeDetectorRef,
    resourcesSvc: SkyAppResourcesService,
  ) {
    this.#changeDetector = changeDetector;
    this.#resourcesSvc = resourcesSvc;
  }

  /**
   * Transforms a named resource string into its value.
   * @param name The name of the resource string.
   */
  public transform(name: string, ...args: any[]): string {
    const cacheKey = name + JSON.stringify(args);

    if (!(cacheKey in this.#resourceCache)) {
      this.#resourcesSvc
        .getString(name, ...args)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((result) => {
          this.#resourceCache[cacheKey] = result;
          this.#changeDetector.markForCheck();
        });
    }

    return this.#resourceCache[cacheKey];
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
