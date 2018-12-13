import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../modal.service';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './modal.visual.content.html',
  providers: [SkyModalService]
})
export class ModalDemoComponent {
  public title = 'Hello world';
}
