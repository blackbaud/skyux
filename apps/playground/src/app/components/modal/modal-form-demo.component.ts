import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal',
  templateUrl: './modal-form-demo.component.html',
  providers: [SkyModalService],
})
export class ModalFormDemoComponent {
  public title = 'Modal form with scroll';
  public showHelp = false;

  constructor(public instance: SkyModalInstance) {}
}
