import {
  Component
} from '@angular/core';

import {
  SkyFlyoutConfig,
  SkyFlyoutService
} from '../../flyout';

import { SkyFlyoutTestSampleComponent } from './flyout-sample.component.fixture';

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
}
