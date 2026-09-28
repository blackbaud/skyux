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
    <div
      [skyInstrumentationContext]="{
        name: 'edit-gift',
        detail: { recordId: '280-c-r-w' },
      }"
    >
      <app-core-instrumentation-modal-launch-button />
    </div>
  `,
})
export class CoreInstrumentationModalExample {}
