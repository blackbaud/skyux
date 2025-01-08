import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-content',
  templateUrl: './modal-content-demo.component.html',
  imports: [SkyModalModule],
})
export class ModalContentDemoComponent {
  constructor(public instance: SkyModalInstance) {}
}
