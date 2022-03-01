import { Component } from '@angular/core';

import { SkyFlyoutService } from '../../flyout/flyout.service';
import { SkyFlyoutConfig } from '../../flyout/types/flyout-config';
import { SkyFlyoutInstance } from '../flyout-instance';

import { SkyFlyoutHostsTestComponent } from './flyout-hosts.component.fixture';
import { SkyFlyoutTestSampleContext } from './flyout-sample-context.fixture';
import { SkyFlyoutTestSampleComponent } from './flyout-sample.component.fixture';

@Component({
  selector: 'sky-test-component',
  templateUrl: './flyout.component.fixture.html',
})
export class SkyFlyoutTestComponent {
  constructor(private flyoutService: SkyFlyoutService) {}

  public openFlyout(options?: SkyFlyoutConfig): SkyFlyoutInstance<any> {
    if (!options) {
      options = {
        providers: [
          {
            provide: SkyFlyoutTestSampleContext,
            useValue: { name: 'Sam', showIframe: false },
          },
        ],
      };
    }

    return this.flyoutService.open(SkyFlyoutTestSampleComponent, options);
  }

  public openHostsFlyout(): SkyFlyoutInstance<any> {
    return this.flyoutService.open(SkyFlyoutHostsTestComponent);
  }
}
