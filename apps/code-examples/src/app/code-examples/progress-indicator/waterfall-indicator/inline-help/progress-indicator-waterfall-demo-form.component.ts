import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { SkyProgressIndicatorWaterfallDemoContext } from './progress-indicator-waterfall-demo-context';

@Component({
  selector: 'app-progress-indicator-waterfall-horizontal-demo',
  templateUrl: './progress-indicator-waterfall-demo-form.component.html',
})
export class SkyProgressIndicatorWaterfallDemoFormComponent {
  constructor(
    public instance: SkyModalInstance,
    public context: SkyProgressIndicatorWaterfallDemoContext
  ) {}

  public submit(): void {
    this.instance.close(undefined, 'save');
  }
}
