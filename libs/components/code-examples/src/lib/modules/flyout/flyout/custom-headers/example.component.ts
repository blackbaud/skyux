import { Component, inject } from '@angular/core';
import { SkyFlyoutInstance, SkyFlyoutService } from '@skyux/flyout';

import { FlyoutComponent } from './flyout.component';

/**
 * @title Flyouts with customized headers
 */
@Component({
  standalone: true,
  selector: 'app-flyout-custom-headers-example',
  templateUrl: './example.component.html',
})
export class FlyoutCustomHeadersExampleComponent {
  public recordNumber = 0;
  public primaryActionCallback(): void {
    alert('Primary action clicked!');
  }

  #flyout: SkyFlyoutInstance<FlyoutComponent> | undefined;

  readonly #flyoutSvc = inject(SkyFlyoutService);

  public openFlyoutWithIterators(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      showIterator: true,
      iteratorNextButtonDisabled: this.#nextButtonDisabled(),
      iteratorPreviousButtonDisabled: this.#previousButtonDisabled(),
    });

    this.#flyout.iteratorNextButtonClick.subscribe(() => {
      alert('Next iterator button clicked!');
      this.recordNumber += 1;
      this.#flyout!.iteratorNextButtonDisabled = this.#nextButtonDisabled();
      this.#flyout!.iteratorPreviousButtonDisabled =
        this.#previousButtonDisabled();
    });

    this.#flyout.iteratorPreviousButtonClick.subscribe(() => {
      alert('Previous iterator button clicked!');
      this.recordNumber -= 1;
      this.#flyout!.iteratorNextButtonDisabled = this.#nextButtonDisabled();
      this.#flyout!.iteratorPreviousButtonDisabled =
        this.#previousButtonDisabled();
    });

    this.#flyout.closed.subscribe(() => {
      this.#flyout = undefined;
    });
  }

  public openFlyoutWithPrimaryAction(): void {
    this.#flyout = this.#flyoutSvc.open(FlyoutComponent, {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      primaryAction: {
        label: 'Save',
        callback: () => {
          this.primaryActionCallback();
        },
      },
    });
  }

  public openFlyoutWithRoutePermalink(): void {
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

  public openFlyoutWithUrlPermalink(): void {
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

  #nextButtonDisabled(): boolean {
    return this.recordNumber >= 3;
  }

  #previousButtonDisabled(): boolean {
    return this.recordNumber <= 0;
  }
}
