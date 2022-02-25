// #region imports
import { SkyLibResourcesService } from './lib-resources.service';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// #endregion

@Pipe({
  name: 'skyLibResources',
  pure: false,
})
export class SkyLibResourcesPipe implements PipeTransform, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  private resourceCache: { [key: string]: any } = {};

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resourcesService: SkyLibResourcesService
  ) {}

  public transform(name: string, ...args: any[]): string {
    const cacheKey = name + JSON.stringify(args);

    if (!(cacheKey in this.resourceCache)) {
      this.resourcesService
        .getString(name, ...args)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value: string) => {
          this.resourceCache[cacheKey] = value;
          this.changeDetector.markForCheck();
        });
    }

    return this.resourceCache[cacheKey];
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
