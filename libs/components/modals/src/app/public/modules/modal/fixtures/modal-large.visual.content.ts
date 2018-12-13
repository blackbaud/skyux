import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../modal.service';

@Component({
  selector: 'sky-test-cmp-modal-large',
  templateUrl: './modal-large.visual.content.html',
  providers: [SkyModalService]
})
export class ModalLargeDemoComponent {
  public title = 'Hello world';
}
