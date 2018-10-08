import { Component } from '@angular/core';

import { SkyFlyoutService } from '../../public/modules/flyout/flyout.service';
import { FlyoutDemoComponent } from './flyout-demo.component';

@Component({
  selector: 'flyout-visual',
  templateUrl: './flyout-visual.component.html'
})
export class FlyoutVisualComponent {
  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public openFlyout() {
    this.flyoutService.open(FlyoutDemoComponent, {
      providers: []
    });
  }
}
