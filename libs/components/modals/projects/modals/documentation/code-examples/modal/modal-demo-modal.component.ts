import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

@Component({
  selector: 'app-modal-demo-modal',
  templateUrl: './modal-demo-modal.component.html'
})
export class ModalDemoModalComponent {

  constructor(
    public instance: SkyModalInstance
  ) { }

}
