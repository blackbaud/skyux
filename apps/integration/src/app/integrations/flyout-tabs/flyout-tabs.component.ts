import { Component } from '@angular/core';
import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutService,
} from '@skyux/flyout';

import { FlyoutTabsContentComponent } from './flyout-tabs-content.component';

screenY;
@Component({
  selector: 'app-flyout-tabs',
  templateUrl: './flyout-tabs.component.html',
})
export class FlyoutTabsComponent {
  public flyout?: SkyFlyoutInstance<any>;

  constructor(private flyoutService: SkyFlyoutService) {}

  public closeAndRemoveFlyout(): void {
    if (this.flyout && this.flyout.isOpen) {
      this.flyoutService.close();
    }
    this.flyout = undefined;
  }

  public openFlyoutWithCutsomWidth(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      defaultWidth: 350,
      maxWidth: 500,
      minWidth: 200,
    };
    this.flyout = this.flyoutService.open(
      FlyoutTabsContentComponent,
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
    this.flyout = this.flyoutService.open(
      FlyoutTabsContentComponent,
      flyoutConfig
    );

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
