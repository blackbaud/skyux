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

@Injectable()
export class SkyFlyoutService implements OnDestroy {
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

  public close(): void {
    if (this.host && !this.isOpening) {
      this.removeAfterClosed = true;
      this.host.instance.messageStream.next({
        type: SkyFlyoutMessageType.Close
      });
    }
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
       * Use mousedown instead of click to capture elements that are removed from DOM on click
       */
      fromEvent(document, 'mousedown')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((event: MouseEvent) => {
          const isChild = flyoutInstance.flyoutRef.nativeElement.contains(event.target);
          const isAbove = this.coreAdapter.isTargetAboveElement(
            event.target,
            flyoutInstance.flyoutRef.nativeElement
          );

          /* istanbul ignore else */
          if (!isChild && !isAbove) {
            this.close();
          }
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
