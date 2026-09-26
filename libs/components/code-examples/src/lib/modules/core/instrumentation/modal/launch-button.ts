import { Component, Injector, inject } from '@angular/core';
import { provideSkyInstrumentationContextFrom } from '@skyux/core';
import { SkyModalService } from '@skyux/modals';

import { CoreInstrumentationModalContent } from './modal';

@Component({
  selector: 'app-core-instrumentation-modal-launch-button',
  template: `
    <button class="sky-btn sky-btn-default" type="button" (click)="openModal()">
      Edit gift
    </button>
  `,
})
export class CoreInstrumentationModalLaunchButton {
  readonly #injector = inject(Injector);
  readonly #modalSvc = inject(SkyModalService);

  protected openModal(): void {
    // A modal renders outside this component's view, so the context above this
    // button must be forwarded explicitly.
    this.#modalSvc.open(CoreInstrumentationModalContent, {
      providers: provideSkyInstrumentationContextFrom(this.#injector),
    });
  }
}
