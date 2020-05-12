import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../../public/public_api';

@Component({
  selector: 'sky-test-cmp-modal-large',
  templateUrl: './modal-large-demo.component.html',
  providers: [SkyModalService]
})
export class ModalLargeDemoComponent {
  public title = 'Hello world';
}
