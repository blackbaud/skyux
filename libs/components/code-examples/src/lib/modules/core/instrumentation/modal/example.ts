import { Component } from '@angular/core';
import { SkyInstrumentationContext } from '@skyux/core';

import { CoreInstrumentationModalLaunchButton } from './launch-button';

/**
 * @title Instrumentation context forwarded to a modal
 */
@Component({
  imports: [CoreInstrumentationModalLaunchButton, SkyInstrumentationContext],
  selector: 'app-core-instrumentation-modal-example',
  template: `
    <div [skyInstrumentationContext]="recordContext">
      <app-core-instrumentation-modal-launch-button />
    </div>
  `,
})
export class CoreInstrumentationModalExample {
  protected readonly recordContext = { recordId: '280-c-r-w' };
}
