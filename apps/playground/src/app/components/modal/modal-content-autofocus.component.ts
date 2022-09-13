import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-autofocus',
  templateUrl: './modal-content-autofocus.component.html',
})
export class ModalContentAutofocusComponent {
  constructor(public instance: SkyModalInstance) {}
}
