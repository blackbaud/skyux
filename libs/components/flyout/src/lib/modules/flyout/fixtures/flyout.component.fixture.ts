import { Component } from '@angular/core';

import { SkyFlyoutService } from '../../flyout/flyout.service';
import { SkyFlyoutConfig } from '../../flyout/types/flyout-config';
import { SkyFlyoutInstance } from '../flyout-instance';

import { SkyFlyoutHostsTestComponent } from './flyout-hosts.component.fixture';
import { SkyFlyoutTestSampleContext } from './flyout-sample-context.fixture';
import { SkyFlyoutTestSampleComponent } from './flyout-sample.component.fixture';

export function flyoutTestSampleFactory(): SkyFlyoutTestSampleContext {
  const context = new SkyFlyoutTestSampleContext('Sam');
  context.showIframe = false;
  return context;
}

@Component({
  selector: 'sky-test-component',
  templateUrl: './flyout.component.fixture.html',
  standalone: false,
})
export class SkyFlyoutTestComponent {
  #flyoutService: SkyFlyoutService;

  constructor(flyoutService: SkyFlyoutService) {
    this.#flyoutService = flyoutService;
  }

  public openFlyout(options?: SkyFlyoutConfig): SkyFlyoutInstance<any> {
    if (!options) {
      options = {
        providers: [
          {
            provide: SkyFlyoutTestSampleContext,
            useFactory: flyoutTestSampleFactory,
          },
        ],
      };
    }

    return this.#flyoutService.open(SkyFlyoutTestSampleComponent, options);
  }

  public openHostsFlyout(): SkyFlyoutInstance<any> {
    return this.#flyoutService.open(SkyFlyoutHostsTestComponent);
  }
}
