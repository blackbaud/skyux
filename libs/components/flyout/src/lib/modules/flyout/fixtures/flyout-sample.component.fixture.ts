import { Component, inject } from '@angular/core';

import { SkyFlyoutTestSampleContext } from './flyout-sample-context.fixture';

@Component({
  selector: 'sky-test-flyout-sample',
  templateUrl: './flyout-sample.component.fixture.html',
  standalone: false,
})
export class SkyFlyoutTestSampleComponent {
  public readonly data = inject(SkyFlyoutTestSampleContext);
}
