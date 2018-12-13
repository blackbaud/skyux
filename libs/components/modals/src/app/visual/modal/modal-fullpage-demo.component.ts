import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../../public';

@Component({
  selector: 'sky-test-cmp-modal-fullpage',
  templateUrl: './modal-fullpage-demo.component.html',
  providers: [SkyModalService]
})
export class ModalFullPageDemoComponent {
  public title = 'Hello world';
}
