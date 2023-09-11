import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { SkyProgressIndicatorWaterfallDemoContext } from './progress-indicator-waterfall-demo-context';

@Component({
  standalone: true,
  selector: 'app-progress-indicator-waterfall-horizontal-demo',
  templateUrl: './progress-indicator-waterfall-demo-form.component.html',
  imports: [SkyModalModule],
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
