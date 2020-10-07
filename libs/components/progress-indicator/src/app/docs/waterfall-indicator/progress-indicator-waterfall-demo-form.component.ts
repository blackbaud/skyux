import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  ProgressIndicatorWaterfallDemoContext
} from './progress-indicator-waterfall-demo-context';

@Component({
  selector: 'app-progress-indicator-waterfall-horizontal-demo',
  templateUrl: './progress-indicator-waterfall-demo-form.component.html'
})
export class ProgressIndicatorWaterfallDemoFormComponent {

  constructor(
    public instance: SkyModalInstance,
    public context: ProgressIndicatorWaterfallDemoContext
  ) { }

  public submit(): void {
    this.instance.close(undefined, 'save');
  }

}
