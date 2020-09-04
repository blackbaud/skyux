import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '../../public/public_api';

@Component({
  selector: 'app-modal-docs-modal',
  templateUrl: './modal-docs-modal.component.html'
})
export class ModalDocsModalComponent {

  constructor(
    public instance: SkyModalInstance
  ) { }

}
