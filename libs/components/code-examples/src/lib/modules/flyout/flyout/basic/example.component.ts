import { Component, inject } from '@angular/core';
import { SkyFlyoutInstance, SkyFlyoutService } from '@skyux/flyout';

import { FlyoutComponent } from './flyout.component';

/**
 * @title Flyout with basic setup
 */
@Component({
  standalone: true,
  selector: 'app-flyout-basic-example',
  templateUrl: './example.component.html',
})
export class FlyoutBasicExampleComponent {
  #flyout: SkyFlyoutInstance<FlyoutComponent> | undefined;

  readonly #flyoutSvc = inject(SkyFlyoutService);

  protected closeAndRemoveFlyout(): void {
    if (this.#flyout?.isOpen) {
      this.#flyoutSvc.close();
    }

    this.#flyout = undefined;
  }

  public openFlyoutWithCustomWidth(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      defaultWidth: 350,
      maxWidth: 500,
      minWidth: 200,
    });

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }

  protected openSimpleFlyout(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
    });

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }
}
