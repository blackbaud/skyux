import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../modal.service';

@Component({
  selector: 'sky-test-cmp-modal-fullpage',
  templateUrl: './modal-fullpage.visual.content.html',
  providers: [SkyModalService]
})
export class ModalFullPageDemoComponent {
  public title = 'Hello world';
}
