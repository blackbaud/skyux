import {
  Component
} from '@angular/core';

import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutService
} from '@skyux/flyout';

import {
  FlyoutDemoFlyoutComponent
} from './flyout-demo-flyout.component';

@Component({
  selector: 'app-flyout-demo',
  templateUrl: './flyout-demo.component.html'
})
export class FlyoutDemoComponent {

  public flyout: SkyFlyoutInstance<any>;

  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public closeAndRemoveFlyout(): void {
    if (this.flyout && this.flyout.isOpen) {
      this.flyoutService.close();
    }
    this.flyout = undefined;
  }

  public openFlyoutWithCutsomWidth(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      defaultWidth: 350,
      maxWidth: 500,
      minWidth: 200
    };
    this.flyout = this.flyoutService.open(FlyoutDemoFlyoutComponent, flyoutConfig);

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }

  public openSimpleFlyout(): void {
    this.flyout = this.flyoutService.open(FlyoutDemoFlyoutComponent);

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
