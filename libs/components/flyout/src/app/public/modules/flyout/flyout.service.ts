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
  Observable,
  Subject
} from 'rxjs';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';

import {
  SkyCoreAdapterService,
  SkyDynamicComponentService,
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyFlyoutComponent
} from './flyout.component';

import {
  SkyFlyoutInstance
} from './flyout-instance';

import {
  SkyFlyoutConfig,
  SkyFlyoutMessage,
  SkyFlyoutMessageType
} from './types';

@Injectable()
export class SkyFlyoutService implements OnDestroy {
  private host: ComponentRef<SkyFlyoutComponent>;
  private removeAfterClosed = false;
  private isOpening: boolean = false;
  private ngUnsubscribe = new Subject<boolean>();

  constructor(
    private coreAdapter: SkyCoreAdapterService,
    private windowRef: SkyWindowRefService,
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
    this.windowRef.getWindow().setTimeout(() => {
      this.isOpening = false;
    });

    if (!this.host) {
      this.host = this.createHostComponent();

      this.router.events
      .takeWhile(() => this.host !== undefined)
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
      Observable
        .fromEvent(document, 'mousedown')
        .takeUntil(this.ngUnsubscribe)
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
        .take(1)
        .subscribe((message: SkyFlyoutMessage) => {
          if (message.type === SkyFlyoutMessageType.Close) {
            this.removeAfterClosed = true;
            this.isOpening = false;
          }
        });

      flyout.closed.take(1).subscribe(() => {
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
