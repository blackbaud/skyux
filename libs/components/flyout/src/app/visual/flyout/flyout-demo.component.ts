import { Component } from '@angular/core';

import { SkyFlyoutService } from '../../public/modules/flyout/flyout.service';

@Component({
  selector: 'sky-test-cmp-flyout',
  templateUrl: './flyout-demo.component.html',
  providers: [SkyFlyoutService]
})
export class FlyoutDemoComponent {
}
