import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-autofocus',
  templateUrl: './modal-content-autofocus.component.html',
  imports: [SkyModalModule],
})
export class ModalContentAutofocusComponent {
  constructor(public instance: SkyModalInstance) {}
}
