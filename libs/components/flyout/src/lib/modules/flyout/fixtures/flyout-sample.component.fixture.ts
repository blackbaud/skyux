import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyFlyoutTestSampleContext } from './flyout-sample-context.fixture';

@Component({
  selector: 'sky-test-flyout-sample',
  templateUrl: './flyout-sample.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyFlyoutTestSampleComponent {
  constructor(public data: SkyFlyoutTestSampleContext) {}
}
