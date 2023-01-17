import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Optional,
} from '@angular/core';
import {
  SkyAppWindowRef,
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';

import { Observable, defer as observableDefer } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SkyWaitPageAdapterService } from './wait-page-adapter.service';
import { SkyWaitPageComponent } from './wait-page.component';

let waitComponent: SkyWaitPageComponent | undefined;
let waitComponentRef: ComponentRef<SkyWaitPageComponent> | undefined;
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
  #dynamicComponentService: SkyDynamicComponentService | undefined;

  // TODO: Remove `Optional` in a future breaking change. When this is done - remove the `resolver` variable and any cases that account for it.
  constructor(
    resolver: ComponentFactoryResolver,
    appRef: ApplicationRef,
    waitAdapter: SkyWaitPageAdapterService,
    windowSvc: SkyAppWindowRef,
    @Optional() dynamicComponentService: SkyDynamicComponentService
  ) {
    this.#resolver = resolver;
    this.#appRef = appRef;
    this.#waitAdapter = waitAdapter;
    this.#windowSvc = windowSvc;
    this.#dynamicComponentService = dynamicComponentService;
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
      // TODO: Remove if-statement and else case when `Optional` is removed from the constructor.
      if (this.#dynamicComponentService) {
        this.#dynamicComponentService.removeComponent(waitComponentRef);
      } else {
        this.#waitAdapter.removePageWaitEl();
      }
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
          // TODO: Remove if-statement and else case when `Optional` is removed from the constructor.
          if (this.#dynamicComponentService) {
            waitComponentRef = this.#dynamicComponentService.createComponent(
              SkyWaitPageComponent,
              { location: SkyDynamicComponentLocation.BodyBottom }
            );
            waitComponent = waitComponentRef.instance;
          } else {
            const factory =
              this.#resolver.resolveComponentFactory(SkyWaitPageComponent);
            this.#waitAdapter.addPageWaitEl();

            waitComponentRef = this.#appRef.bootstrap(factory);
            waitComponent = waitComponentRef.instance;
          }
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
