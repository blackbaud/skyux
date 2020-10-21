import {
  ComponentRef,
  Injectable,
  OnDestroy,
  Type
} from '@angular/core';

import {
  NavigationStart,
  Router
} from '@angular/router';

import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyDynamicComponentService
} from '@skyux/core';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  take,
  takeUntil,
  takeWhile
} from 'rxjs/operators';

import {
  SkyFlyoutComponent
} from './flyout.component';

import {
  SkyFlyoutInstance
} from './flyout-instance';

import {
  SkyFlyoutConfig
} from './types/flyout-config';

import {
  SkyFlyoutMessage
} from './types/flyout-message';

import {
  SkyFlyoutMessageType
} from './types/flyout-message-type';

/**
 * Launches flyouts and provides a common look and feel.
 * This service dynamically generates the flyout component and appends it directly to the
 * document's `body` element. The `SkyFlyoutInstance` class watches for and triggers flyout events.
 */
@Injectable()
export class SkyFlyoutService implements OnDestroy {
  private clickOnFlyout: boolean = false;
  private host: ComponentRef<SkyFlyoutComponent>;
  private removeAfterClosed = false;
  private isOpening: boolean = false;
  private ngUnsubscribe = new Subject<boolean>();

  constructor(
    private coreAdapter: SkyCoreAdapterService,
    private windowRef: SkyAppWindowRef,
    private dynamicComponentService: SkyDynamicComponentService,
    private router: Router
  ) { }

  public ngOnDestroy(): void {
    this.removeListners();
    if (this.host) {
      this.removeHostComponent();
    }
  }

  /**
   * Closes the flyout. This method also removes the flyout's HTML elements from the DOM.
   */
  public close(): void {
    if (this.host && !this.isOpening) {
      this.removeAfterClosed = true;
      this.host.instance.messageStream.next({
        type: SkyFlyoutMessageType.Close
      });
    }
  }

  /**
   * Opens a flyout and displays the specified component.
   * @param component Specifies the component to render. Since you generate the component dynamically instead of
   * with HTML selectors, you must register it with the `entryComponents` property in the
   * `app-extras.module.ts` file. For more information, see the
   * [entry components tutorial](https://developer.blackbaud.com/skyux/learn/get-started/advanced/entry-components).
   * @param config Specifies the flyout configuration passed to the specified component's constructor.
   */
  public open<T>(component: Type<T>, config?: SkyFlyoutConfig): SkyFlyoutInstance<T> {
    // isOpening flag will prevent close() from firing when open() is also fired.
    this.isOpening = true;
    this.windowRef.nativeWindow.setTimeout(() => {
      this.isOpening = false;
    });

    if (!this.host) {
      this.host = this.createHostComponent();

      this.router.events
      .pipe(takeWhile(() => this.host !== undefined))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.close();
        }
      });
    }

    const flyout = this.host.instance.attach(component, config);

    this.addListeners(flyout);

    return flyout;
  }

  private createHostComponent(): ComponentRef<SkyFlyoutComponent> {
    this.host = this.dynamicComponentService.createComponent(SkyFlyoutComponent);
    return this.host;
  }

  private removeHostComponent(): void {
    if (this.host) {
      this.dynamicComponentService.removeComponent(this.host);
      this.host = undefined;
    }
  }

  private addListeners<T>(flyout: SkyFlyoutInstance<T>): void {
    if (this.host) {
      const flyoutInstance = this.host.instance;

      /**
       * Flyout should close when user clicks outside of flyout.
       */
      fromEvent(document, 'click')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((event: MouseEvent) => {
          if (this.host.instance.isDragging) {
            return;
          }

          const isAbove = event.target === document ? false : this.coreAdapter.isTargetAboveElement(
            event.target,
            flyoutInstance.flyoutRef.nativeElement
          );

          /* istanbul ignore else */
          if (!this.clickOnFlyout && !isAbove) {
            this.close();
          }
        });

      fromEvent(flyoutInstance.flyoutRef.nativeElement, 'click')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((event: MouseEvent) => {
          this.clickOnFlyout = true;
          this.windowRef.nativeWindow.setTimeout(() => {
            this.clickOnFlyout = false;
          });
        });

      this.removeAfterClosed = false;
      flyoutInstance.messageStream
        .pipe(take(1))
        .subscribe((message: SkyFlyoutMessage) => {
          if (message.type === SkyFlyoutMessageType.Close) {
            this.removeAfterClosed = true;
            this.isOpening = false;
          }
        });

      flyout.closed.pipe(take(1)).subscribe(() => {
        this.removeListners();
        if (this.removeAfterClosed) {
          this.removeHostComponent();
        }
      });
    }
  }

  private removeListners(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
    this.ngUnsubscribe = new Subject<boolean>();
  }
}
