import { SkyAppResourcesService } from './resources.service';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * An Angular pipe for displaying a resource string.
 */
@Pipe({
  name: 'skyAppResources',
  pure: false,
})
export class SkyAppResourcesPipe implements PipeTransform, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  private resourceCache: { [key: string]: any } = {};

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resourcesSvc: SkyAppResourcesService
  ) {}

  /**
   * Transforms a named resource string into its value.
   * @param name The name of the resource string.
   */
  public transform(name: string, ...args: any[]): string {
    const cacheKey = name + JSON.stringify(args);

    if (!(cacheKey in this.resourceCache)) {
      this.resourcesSvc
        .getString(name, ...args)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result) => {
          this.resourceCache[cacheKey] = result;
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
