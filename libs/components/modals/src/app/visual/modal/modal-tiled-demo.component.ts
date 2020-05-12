import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../../public/public_api';

@Component({
  selector: 'sky-test-cmp-modal-tiled',
  templateUrl: './modal-tiled-demo.component.html',
  providers: [SkyModalService]
})
export class ModalTiledDemoComponent {
  public title = 'Hello world';
}
