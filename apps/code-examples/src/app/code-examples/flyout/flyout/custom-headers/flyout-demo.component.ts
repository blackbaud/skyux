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
  public flyout: SkyFlyoutInstance<any>;

  constructor(private flyoutService: SkyFlyoutService) {}

  public openFlyoutWithIterators(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      showIterator: true,
    };
    this.flyout = this.flyoutService.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.flyout.iteratorNextButtonClick.subscribe(() => {
      alert('Next iterator button clicked!');
    });

    this.flyout.iteratorPreviousButtonClick.subscribe(() => {
      alert('Prvious iterator button clicked!');
    });

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }

  public openFlyoutWithRoutePermalink(): void {
    const flyoutConfig: SkyFlyoutConfig = {
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
    };
    this.flyout = this.flyoutService.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }

  public openFlyoutWithUrlPermalink(): void {
    const flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      permalink: {
        label: `Visit blackbaud.com`,
        url: 'http://www.blackbaud.com',
      },
    };
    this.flyout = this.flyoutService.open(
      FlyoutDemoFlyoutComponent,
      flyoutConfig
    );

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
