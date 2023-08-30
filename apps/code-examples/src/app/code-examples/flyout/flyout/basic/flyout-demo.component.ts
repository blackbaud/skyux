import { Component, inject } from '@angular/core';
import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutService,
} from '@skyux/flyout';

import { FlyoutDemoFlyoutComponent } from './flyout-demo-flyout.component';

@Component({
  selector: 'app-flyout-demo',
  templateUrl: './flyout-demo.component.html',
})
export class FlyoutDemoComponent {
  #flyout: SkyFlyoutInstance<FlyoutDemoFlyoutComponent> | undefined;

  readonly #flyoutSvc = inject(SkyFlyoutService);

  protected closeAndRemoveFlyout(): void {
    if (this.#flyout?.isOpen) {
      this.#flyoutSvc.close();
    }

    this.#flyout = undefined;
  }

  protected openFlyoutWithCustomWidth(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      defaultWidth: 350,
      maxWidth: 500,
      minWidth: 200,
    };

    this.#flyout = this.#flyoutSvc.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }

  protected openSimpleFlyout(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
    };

    this.#flyout = this.#flyoutSvc.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }
}
