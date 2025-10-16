// #region imports
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyLibResourcesService } from './lib-resources.service';

// #endregion

@Pipe({
  name: 'skyLibResources',
  pure: false,
})
export class SkyLibResourcesPipe implements PipeTransform, OnDestroy {
  #ngUnsubscribe = new Subject<void>();

  #resourceCache: Record<string, any> = {};

  #changeDetector: ChangeDetectorRef;
  #resourcesService: SkyLibResourcesService;

  constructor(
    changeDetector: ChangeDetectorRef,
    resourcesService: SkyLibResourcesService,
  ) {
    this.#changeDetector = changeDetector;
    this.#resourcesService = resourcesService;
  }

  public transform(name: string, ...args: any[]): string {
    const cacheKey = name + JSON.stringify(args);

    if (!(cacheKey in this.#resourceCache)) {
      this.#resourcesService
        .getString(name, ...args)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value: string) => {
          this.#resourceCache[cacheKey] = value;
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
