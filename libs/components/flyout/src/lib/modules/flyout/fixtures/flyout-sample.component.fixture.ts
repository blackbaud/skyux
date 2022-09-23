import { Component, Inject } from '@angular/core';

import { SKY_FLYOUT_SAMPLE_CONTEXT } from './flyout-sample-context-token';
import { SkyFlyoutTestSampleContext } from './flyout-sample-context.fixture';

@Component({
  selector: 'sky-test-flyout-sample',
  templateUrl: './flyout-sample.component.fixture.html',
})
export class SkyFlyoutTestSampleComponent {
  constructor(
    @Inject(SKY_FLYOUT_SAMPLE_CONTEXT) public data: SkyFlyoutTestSampleContext
  ) {}
}
