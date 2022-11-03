import { Component } from '@angular/core';
import { SkyLabelType } from '@skyux/indicators';

import { FlyoutDemoContext } from './flyout-demo-context';

@Component({
  selector: 'app-flyout-demo-flyout',
  templateUrl: `flyout-demo-flyout.component.html`,
})
export class FlyoutDemoFlyoutComponent {
  public labelType: SkyLabelType;
  constructor(public context: FlyoutDemoContext) {
    context.status === 'Past due' ? 'danger' : 'success';
  }
}
