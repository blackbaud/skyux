import { Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-content',
  templateUrl: './modal-content-demo.component.html',
  imports: [SkyModalModule],
})
export class ModalContentDemoComponent {
  public readonly instance = inject(SkyModalInstance);
}
