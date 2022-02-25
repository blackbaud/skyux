import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
} from '@angular/core';

import { SkyAppWindowRef } from '@skyux/core';

import { defer as observableDefer, Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';

import { SkyWaitPageAdapterService } from './wait-page-adapter.service';

import { SkyWaitPageComponent } from './wait-page.component';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
@Injectable({
  providedIn: 'root',
})
export class SkyWaitService {
  private static waitComponent: SkyWaitPageComponent;
  private static pageWaitBlockingCount = 0;
  private static pageWaitNonBlockingCount = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private waitAdapter: SkyWaitPageAdapterService,
    private windowSvc: SkyAppWindowRef
  ) {}

  /**
   * Starts a blocking page wait on the page.
   */
  public beginBlockingPageWait(): void {
    this.beginPageWait(true);
  }

  /**
   * Starts a non-blocking page wait on the page.
   */
  public beginNonBlockingPageWait(): void {
    this.beginPageWait(false);
  }

  /**
   * Ends a blocking page wait on the page. Blocking page wait indication
   * is removed when all running blocking page waits are ended.
   */
  public endBlockingPageWait(): void {
    this.endPageWait(true);
  }

  /**
   * Ends a non-blocking page wait on the page. Non-blocking page wait indication
   * is removed when all running non-blocking page waits are ended.
   */
  public endNonBlockingPageWait(): void {
    this.endPageWait(false);
  }

  /**
   * Clears all blocking and non-blocking page waits on the page.
   */
  public clearAllPageWaits(): void {
    this.clearPageWait(true);
    this.clearPageWait(false);
  }

  /**
   * @internal
   */
  public dispose(): void {
    if (SkyWaitService.waitComponent) {
      SkyWaitService.waitComponent = undefined;
      SkyWaitService.pageWaitBlockingCount = 0;
      SkyWaitService.pageWaitNonBlockingCount = 0;
      this.waitAdapter.removePageWaitEl();
    }
  }

  /**
   * Launches a page wait and automatically stops when the specific asynchronous event completes.
   */
  public blockingWrap<T>(observable: Observable<T>): Observable<T> {
    return observableDefer(() => {
      this.beginBlockingPageWait();
      return observable.pipe(finalize(() => this.endBlockingPageWait()));
    });
  }

  /**
   * Launches a non-blocking page wait and automatically stops when the specific
   * asynchronous event completes.
   */
  public nonBlockingWrap<T>(observable: Observable<T>): Observable<T> {
    return observableDefer(() => {
      this.beginNonBlockingPageWait();
      return observable.pipe(finalize(() => this.endNonBlockingPageWait()));
    });
  }

  private setWaitComponentProperties(isBlocking: boolean): void {
    if (isBlocking) {
      SkyWaitService.waitComponent.hasBlockingWait = true;
      SkyWaitService.pageWaitBlockingCount++;
    } else {
      SkyWaitService.waitComponent.hasNonBlockingWait = true;
      SkyWaitService.pageWaitNonBlockingCount++;
    }
  }

  private beginPageWait(isBlocking: boolean): void {
    if (!SkyWaitService.waitComponent) {
      /*
          Dynamic component creation needs to be done in a timeout to prevent ApplicationRef from
          crashing when wait service is called in Angular lifecycle functions.
      */
      this.windowSvc.nativeWindow.setTimeout(() => {
        // Ensuring here that we recheck this after the setTimeout is over so that we don't clash
        // with any other waits that are created.
        if (!SkyWaitService.waitComponent) {
          const factory =
            this.resolver.resolveComponentFactory(SkyWaitPageComponent);
          this.waitAdapter.addPageWaitEl();

          const cmpRef = this.appRef.bootstrap(factory);
          SkyWaitService.waitComponent = cmpRef.instance;
        }

        this.setWaitComponentProperties(isBlocking);
      });
    } else {
      this.setWaitComponentProperties(isBlocking);
    }
  }

  private endPageWait(isBlocking: boolean): void {
    /*
        Needs to yield so that wait creation can finish
        before it is dismissed in the event of a race.
    */
    this.windowSvc.nativeWindow.setTimeout(() => {
      if (SkyWaitService.waitComponent) {
        if (isBlocking) {
          if (SkyWaitService.pageWaitBlockingCount > 0) {
            SkyWaitService.pageWaitBlockingCount--;
          }

          if (SkyWaitService.pageWaitBlockingCount < 1) {
            SkyWaitService.waitComponent.hasBlockingWait = false;
          }
        } else {
          if (SkyWaitService.pageWaitNonBlockingCount > 0) {
            SkyWaitService.pageWaitNonBlockingCount--;
          }

          if (SkyWaitService.pageWaitNonBlockingCount < 1) {
            SkyWaitService.waitComponent.hasNonBlockingWait = false;
          }
        }
      }
    });
  }

  private clearPageWait(isBlocking: boolean): void {
    if (SkyWaitService.waitComponent) {
      if (isBlocking) {
        SkyWaitService.pageWaitBlockingCount = 0;
        SkyWaitService.waitComponent.hasBlockingWait = false;
      } else {
        SkyWaitService.pageWaitNonBlockingCount = 0;
        SkyWaitService.waitComponent.hasNonBlockingWait = false;
      }
    }
  }
}
