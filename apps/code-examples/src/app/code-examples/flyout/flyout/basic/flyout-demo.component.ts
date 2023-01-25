import { Component } from '@angular/core';
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
  public flyout: SkyFlyoutInstance<FlyoutDemoFlyoutComponent> | undefined;

  #flyoutService: SkyFlyoutService;

  constructor(flyoutService: SkyFlyoutService) {
    this.#flyoutService = flyoutService;
  }

  public closeAndRemoveFlyout(): void {
    if (this.flyout && this.flyout.isOpen) {
      this.#flyoutService.close();
    }
    this.flyout = undefined;
  }

  public openFlyoutWithCustomWidth(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      defaultWidth: 350,
      maxWidth: 500,
      minWidth: 200,
    };
    this.flyout = this.#flyoutService.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }

  public openSimpleFlyout(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
    };
    this.flyout = this.#flyoutService.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
