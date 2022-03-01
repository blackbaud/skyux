import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  NgZone,
  OnDestroy,
  Type,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyDynamicComponentService,
} from '@skyux/core';

import { Subject, fromEvent } from 'rxjs';
import { take, takeUntil, takeWhile } from 'rxjs/operators';

import { SkyFlyoutInstance } from './flyout-instance';
import { SkyFlyoutComponent } from './flyout.component';
import { SkyFlyoutCloseArgs } from './types/flyout-close-args';
import { SkyFlyoutConfig } from './types/flyout-config';
import { SkyFlyoutMessage } from './types/flyout-message';
import { SkyFlyoutMessageType } from './types/flyout-message-type';

/**
 * Launches flyouts and provides a common look and feel.
 * This service dynamically generates the flyout component and appends it directly to the
 * document's `body` element. The `SkyFlyoutInstance` class watches for and triggers flyout events.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyFlyoutService implements OnDestroy {
  private host: ComponentRef<SkyFlyoutComponent>;
  private removeAfterClosed = false;
  private isOpening = false;
  private ngUnsubscribe = new Subject<boolean>();

  constructor(
    private coreAdapter: SkyCoreAdapterService,
    private windowRef: SkyAppWindowRef,
    private dynamicComponentService: SkyDynamicComponentService,
    private router: Router,
    private readonly _ngZone: NgZone,
    private readonly applicationRef: ApplicationRef
  ) {}

  public ngOnDestroy(): void {
    this.removeListners();
    if (this.host) {
      this.removeHostComponent();
    }
  }

  /**
   * Closes the flyout. This method also removes the flyout's HTML elements from the DOM.
   * @param args Arguments used when closing the flyout.
   */
  public close(args?: SkyFlyoutCloseArgs): void {
    if (this.host && !this.isOpening) {
      this.removeAfterClosed = true;
      this.host.instance.messageStream.next({
        type: SkyFlyoutMessageType.Close,
        data: {
          ignoreBeforeClose: args ? args.ignoreBeforeClose : false,
        },
      });
    }
  }

  /**
   * Opens a flyout and displays the specified component.
   * @param component Specifies the component to render.
   * @param config Specifies the flyout configuration passed to the specified component's constructor.
   */
  public open<T>(
    component: Type<T>,
    config?: SkyFlyoutConfig
  ): SkyFlyoutInstance<T> {
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

            // Sanity check - if the host still exists after animations should have completed - remove host
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
              if (this.host) {
                this.removeHostComponent();
                // Without this tick - the host does not actually get removed on initial navigation in this case.
                this.applicationRef.tick();
              }
            });
          }
        });
    }

    const flyout = this.host.instance.attach(component, config);

    this.addListeners(flyout);

    return flyout;
  }

  private createHostComponent(): ComponentRef<SkyFlyoutComponent> {
    this.host =
      this.dynamicComponentService.createComponent(SkyFlyoutComponent);
    return this.host;
  }

  private removeHostComponent(): void {
    if (this.host) {
      this.dynamicComponentService.removeComponent(this.host);
      this.host = undefined;
    }
  }

  private addListeners<T>(flyout: SkyFlyoutInstance<T>): void {
    /* istanbul ignore else */
    if (this.host) {
      const flyoutInstance = this.host.instance;

      let doClose = false;

      /**
       * Handles when to close a flyout.
       * Note: We're using `mouseup` in order to capture the parent of certain targets that will be
       * deleted immediately after being clicked. If we use `click`, the event is fired after the
       * element is removed from the DOM making it impossible to check the parent's z-index
       * relative to the flyout's container.
       */
      fromEvent(document, 'mouseup')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((event: MouseEvent) => {
          doClose = false;

          if (this.host.instance.isDragging) {
            return;
          }

          if (flyoutInstance.flyoutRef.nativeElement.contains(event.target)) {
            return;
          }

          const isAbove =
            event.target === document
              ? false
              : this.coreAdapter.isTargetAboveElement(
                  event.target,
                  flyoutInstance.flyoutRef.nativeElement
                );

          /* istanbul ignore else */
          if (!isAbove) {
            doClose = true;
          }
        });

      /**
       * Check if we should close the flyout specifically on a `click` event so that we can keep
       * it open when consumers fire another `click` event on a trigger button. Since the consumer
       * will likely use a `click` event to open the flyout, we want to wait for that event to fire
       * before determining if the flyout should be closed.
       */
      fromEvent(document, 'click')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          if (doClose) {
            this.close();
          }
        });

      this.removeAfterClosed = false;
      flyoutInstance.messageStream
        .pipe(takeUntil(this.ngUnsubscribe))
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
