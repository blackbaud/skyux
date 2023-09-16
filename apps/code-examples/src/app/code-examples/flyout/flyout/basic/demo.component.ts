import { Component, inject } from '@angular/core';
import { SkyFlyoutInstance, SkyFlyoutService } from '@skyux/flyout';

import { FlyoutComponent } from './flyout.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  #flyout: SkyFlyoutInstance<FlyoutComponent> | undefined;

  readonly #flyoutSvc = inject(SkyFlyoutService);

  protected closeAndRemoveFlyout(): void {
    if (this.#flyout?.isOpen) {
      this.#flyoutSvc.close();
    }

    this.#flyout = undefined;
  }

  protected openFlyoutWithCustomWidth(): void {
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
