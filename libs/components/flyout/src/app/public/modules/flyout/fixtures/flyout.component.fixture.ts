import {
  Component
} from '@angular/core';

import {
  SkyFlyoutConfig,
  SkyFlyoutService
} from '../../flyout';

import {
  SkyFlyoutHostsTestComponent
} from './flyout-hosts.component.fixture';

import {
  SkyFlyoutTestSampleComponent
} from './flyout-sample.component.fixture';

@Component({
  selector: 'sky-test-component',
  template: 'noop'
})
export class SkyFlyoutTestComponent {
  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public openFlyout(options?: SkyFlyoutConfig) {
    return this.flyoutService.open(SkyFlyoutTestSampleComponent, options);
  }

  public openHostsFlyout() {
    return this.flyoutService.open(SkyFlyoutHostsTestComponent);
  }
}
