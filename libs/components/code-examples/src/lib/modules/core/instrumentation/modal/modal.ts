import { Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-core-instrumentation-modal-content',
  imports: [SkyModalModule],
  templateUrl: './modal.html',
})
export class CoreInstrumentationModalContent {
  protected readonly modal = inject(SkyModalInstance);
}
