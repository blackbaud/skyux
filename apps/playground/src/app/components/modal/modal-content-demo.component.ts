import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-content',
  templateUrl: './modal-content-demo.component.html',
})
export class ModalContentDemoComponent {
  constructor(public instance: SkyModalInstance) {}
}
