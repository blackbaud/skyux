import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
} from '@angular/core';
import { SkyAppWindowRef, SkyLogService } from '@skyux/core';

import { Observable, defer as observableDefer } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SkyWaitBlockingWrapArgs } from './types/wait-blocking-wrap-args';
import { SkyWaitNonBlockingWrapArgs } from './types/wait-non-blocking-wrap-args';
import { SkyWaitPageAdapterService } from './wait-page-adapter.service';
import { SkyWaitPageComponent } from './wait-page.component';

let waitComponent: SkyWaitPageComponent | undefined;
let pageWaitBlockingCount = 0;
let pageWaitNonBlockingCount = 0;

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
@Injectable({
  providedIn: 'root',
})
export class SkyWaitService {
  #resolver: ComponentFactoryResolver;
  #appRef: ApplicationRef;
  #waitAdapter: SkyWaitPageAdapterService;
  #windowSvc: SkyAppWindowRef;
  #logService: SkyLogService;

  constructor(
    resolver: ComponentFactoryResolver,
    appRef: ApplicationRef,
    waitAdapter: SkyWaitPageAdapterService,
    windowSvc: SkyAppWindowRef,
    logService: SkyLogService
  ) {
    this.#resolver = resolver;
    this.#appRef = appRef;
    this.#waitAdapter = waitAdapter;
    this.#windowSvc = windowSvc;
    this.#logService = logService;
  }

  /**
   * Starts a blocking page wait on the page.
   */
  public beginBlockingPageWait(): void {
    this.#beginPageWait(true);
  }

  /**
   * Starts a non-blocking page wait on the page.
   */
  public beginNonBlockingPageWait(): void {
    this.#beginPageWait(false);
  }

  /**
   * Ends a blocking page wait on the page. Blocking page wait indication
   * is removed when all running blocking page waits are ended.
   */
  public endBlockingPageWait(): void {
    this.#endPageWait(true);
  }

  /**
   * Ends a non-blocking page wait on the page. Non-blocking page wait indication
   * is removed when all running non-blocking page waits are ended.
   */
  public endNonBlockingPageWait(): void {
    this.#endPageWait(false);
  }

  /**
   * Clears all blocking and non-blocking page waits on the page.
   */
  public clearAllPageWaits(): void {
    this.#clearPageWait(true);
    this.#clearPageWait(false);
  }

  /**
   * @internal
   */
  public dispose(): void {
    if (waitComponent) {
      waitComponent = undefined;
      pageWaitBlockingCount = 0;
      pageWaitNonBlockingCount = 0;
      this.#waitAdapter.removePageWaitEl();
    }
  }

  /**
   * Launches a page wait and automatically stops when the specific asynchronous event completes.
   */
  public blockingWrap<T>(args: SkyWaitBlockingWrapArgs<T>): Observable<T>;
  /**
   * @deprecated
   */
  public blockingWrap<T>(observable: Observable<T>): Observable<T>;
  public blockingWrap<T>(
    value: SkyWaitBlockingWrapArgs<T> | Observable<T>
  ): Observable<T> {
    let observable: Observable<T> = value as Observable<T>;
    const typeChecker = value as SkyWaitBlockingWrapArgs<T>;
    if (typeChecker.observable !== undefined) {
      observable = (value as SkyWaitBlockingWrapArgs<T>).observable;
    } else {
      this.#logService.deprecated(
        'Use of the `blockingWrap` method with an `Observable<T> parameter',
        {
          deprecationMajorVersion: 7,
          replacementRecommendation:
            'Use the version of the `blockingWrap` function which takes in `SkyWaitBlockingWrapArgs`.',
        }
      );
    }

    return observableDefer(() => {
      this.beginBlockingPageWait();
      return observable.pipe(finalize(() => this.endBlockingPageWait()));
    });
  }

  /**
   * Launches a non-blocking page wait and automatically stops when the specific
   * asynchronous event completes.
   */
  public nonBlockingWrap<T>(args: SkyWaitNonBlockingWrapArgs<T>): Observable<T>;
  /**
   * @deprecated
   */
  public nonBlockingWrap<T>(observable: Observable<T>): Observable<T>;
  public nonBlockingWrap<T>(
    value: SkyWaitNonBlockingWrapArgs<T> | Observable<T>
  ): Observable<T> {
    let observable: Observable<T> = value as Observable<T>;
    const typeChecker = value as SkyWaitNonBlockingWrapArgs<T>;
    if (typeChecker.observable !== undefined) {
      observable = (value as SkyWaitNonBlockingWrapArgs<T>).observable;
    } else {
      this.#logService.deprecated(
        'Use of the `nonBlockingWrap` method with an `Observable<T> parameter',
        {
          deprecationMajorVersion: 7,
          replacementRecommendation:
            'Use the version of the `nonBlockingWrap` function which takes in `SkyWaitNonBlockingWrapArgs`.',
        }
      );
    }

    return observableDefer(() => {
      this.beginNonBlockingPageWait();
      return observable.pipe(finalize(() => this.endNonBlockingPageWait()));
    });
  }

  #setWaitComponentProperties(isBlocking: boolean): void {
    if (waitComponent) {
      if (isBlocking) {
        waitComponent.hasBlockingWait = true;
        pageWaitBlockingCount++;
      } else {
        waitComponent.hasNonBlockingWait = true;
        pageWaitNonBlockingCount++;
      }
    }
  }

  #beginPageWait(isBlocking: boolean): void {
    if (!waitComponent) {
      /*
          Dynamic component creation needs to be done in a timeout to prevent ApplicationRef from
          crashing when wait service is called in Angular lifecycle functions.
      */
      this.#windowSvc.nativeWindow.setTimeout(() => {
        // Ensuring here that we recheck this after the setTimeout is over so that we don't clash
        // with any other waits that are created.
        if (!waitComponent) {
          const factory =
            this.#resolver.resolveComponentFactory(SkyWaitPageComponent);
          this.#waitAdapter.addPageWaitEl();

          const cmpRef = this.#appRef.bootstrap(factory);
          waitComponent = cmpRef.instance;
        }

        this.#setWaitComponentProperties(isBlocking);
      });
    } else {
      this.#setWaitComponentProperties(isBlocking);
    }
  }

  #endPageWait(isBlocking: boolean): void {
    /*
        Needs to yield so that wait creation can finish
        before it is dismissed in the event of a race.
    */
    this.#windowSvc.nativeWindow.setTimeout(() => {
      if (waitComponent) {
        if (isBlocking) {
          if (pageWaitBlockingCount > 0) {
            pageWaitBlockingCount--;
          }

          if (pageWaitBlockingCount < 1) {
            waitComponent.hasBlockingWait = false;
          }
        } else {
          if (pageWaitNonBlockingCount > 0) {
            pageWaitNonBlockingCount--;
          }

          if (pageWaitNonBlockingCount < 1) {
            waitComponent.hasNonBlockingWait = false;
          }
        }
      }
    });
  }

  #clearPageWait(isBlocking: boolean): void {
    if (waitComponent) {
      if (isBlocking) {
        pageWaitBlockingCount = 0;
        waitComponent.hasBlockingWait = false;
      } else {
        pageWaitNonBlockingCount = 0;
        waitComponent.hasNonBlockingWait = false;
      }
    }
  }
}
