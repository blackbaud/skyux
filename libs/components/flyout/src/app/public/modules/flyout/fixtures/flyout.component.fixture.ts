import {
  Component
} from '@angular/core';

import {
  SkyFlyoutConfig
} from '../../flyout/types/flyout-config';

import {
  SkyFlyoutService
} from '../../flyout/flyout.service';

import {
  SkyFlyoutHostsTestComponent
} from './flyout-hosts.component.fixture';

import {
  SkyFlyoutInstance
} from '../flyout-instance';

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

  public openFlyout(options?: SkyFlyoutConfig): SkyFlyoutInstance<any> {
    return this.flyoutService.open(SkyFlyoutTestSampleComponent, options);
  }

  public openHostsFlyout(): SkyFlyoutInstance<any> {
    return this.flyoutService.open(SkyFlyoutHostsTestComponent);
  }
}
