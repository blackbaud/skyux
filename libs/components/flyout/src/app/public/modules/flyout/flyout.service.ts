import {
  ComponentRef,
  Injectable,
  Type,
  OnDestroy
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

import 'rxjs/add/operator/take';

import {
  SkyWindowRefService,
  SkyDynamicComponentService
} from '@skyux/core';

import {
  SkyFlyoutAdapterService
} from './flyout-adapter.service';

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
  private idled = new Subject<boolean>();

  constructor(
    private adapter: SkyFlyoutAdapterService,
    private windowRef: SkyWindowRefService,
    private dynamicComponentService: SkyDynamicComponentService
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

  private removeHostComponent() {
    if (this.host) {
      this.dynamicComponentService.removeComponent(this.host);
      this.host = undefined;
    }
  }

  private addListeners<T>(flyout: SkyFlyoutInstance<T>): void {
    if (this.host) {
      const windowObj = this.windowRef.getWindow();

      // Flyout should close when user clicks outside of flyout.
      Observable
      .fromEvent(windowObj, 'click')
      .takeUntil(this.idled)
      .subscribe((event: any) => {
        if (!this.adapter.hostContainsEventTarget(this.host, event)) {
          this.close();
        }
      });

      this.removeAfterClosed = false;
      this.host.instance.messageStream
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

  private removeListners() {
    this.idled.next(true);
    this.idled.unsubscribe();
    this.idled = new Subject<boolean>();
  }
}
