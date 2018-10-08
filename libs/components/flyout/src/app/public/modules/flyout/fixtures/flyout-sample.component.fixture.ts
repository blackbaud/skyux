import {
  Component
} from '@angular/core';

import { SkyFlyoutTestSampleContext } from './flyout-sample-context.fixture';

@Component({
  selector: 'sky-test-flyout-sample',
  template: '{{ data?.name }}<iframe src="https://developer.blackbaud.com/skyux/" *ngIf="data?.showIframe"></iframe>'
})
export class SkyFlyoutTestSampleComponent {
  constructor(
    public data: SkyFlyoutTestSampleContext
  ) { }
}
