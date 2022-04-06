import { Component } from '@angular/core';
import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutService,
} from '@skyux/flyout';

import { ResizeObserverContentComponent } from './resize-observer-content.component';

@Component({
  selector: 'app-resize-observer-flyout',
  templateUrl: './resize-observer-flyout.component.html',
})
export class ResizeObserverFlyoutComponent {
  public flyout: SkyFlyoutInstance<any>;

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
      ResizeObserverContentComponent,
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
      ResizeObserverContentComponent,
      flyoutConfig
    );

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
