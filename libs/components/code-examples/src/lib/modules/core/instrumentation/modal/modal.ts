import { Component, inject } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-core-instrumentation-modal-content',
  imports: [SkyButton, SkyModalModule],
  templateUrl: './modal.html',
})
export class CoreInstrumentationModalContent {
  protected readonly modal = inject(SkyModalInstance);
}
