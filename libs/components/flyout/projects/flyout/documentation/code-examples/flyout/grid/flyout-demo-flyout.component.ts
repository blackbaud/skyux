import {
  Component
} from '@angular/core';

import {
  FlyoutDemoContext
} from './flyout-demo-context';

@Component({
  selector: 'app-flyout-demo-flyout',
  templateUrl: `flyout-demo-flyout.component.html`
})
export class FlyoutDemoFlyoutComponent {

  constructor(
    public context: FlyoutDemoContext
  ) { }

}
