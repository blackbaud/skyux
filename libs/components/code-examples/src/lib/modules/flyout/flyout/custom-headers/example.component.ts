import { Component, inject } from '@angular/core';
import { SkyFlyoutInstance, SkyFlyoutService } from '@skyux/flyout';

import { FlyoutComponent } from './flyout.component';

@Component({
  standalone: true,
  selector: 'app-flyout-custom-headers-example',
  templateUrl: './example.component.html',
})
export class FlyoutCustomHeadersExampleComponent {
  #flyout: SkyFlyoutInstance<FlyoutComponent> | undefined;

  readonly #flyoutSvc = inject(SkyFlyoutService);

  protected openFlyoutWithIterators(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      showIterator: true,
    });

    this.#flyout.iteratorNextButtonClick.subscribe(() => {
      alert('Next iterator button clicked!');
    });

    this.#flyout.iteratorPreviousButtonClick.subscribe(() => {
      alert('Previous iterator button clicked!');
    });

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }

  protected openFlyoutWithRoutePermalink(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      permalink: {
        label: 'Go to Components page',
        route: {
          commands: ['/components'],
          extras: {
            fragment: 'helloWorld',
            queryParams: {
              foo: 'bar',
            },
          },
        },
      },
    });

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }

  protected openFlyoutWithUrlPermalink(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      permalink: {
        label: `Visit blackbaud.com`,
        url: 'http://www.blackbaud.com',
      },
    });

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }
}
