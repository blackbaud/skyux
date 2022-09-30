import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-tiled',
  templateUrl: './modal-tiled-demo.component.html',
  providers: [SkyModalService],
})
export class ModalTiledDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
