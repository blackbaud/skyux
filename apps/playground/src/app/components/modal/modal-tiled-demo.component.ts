import { Component } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  selector: 'app-test-cmp-modal-tiled',
  templateUrl: './modal-tiled-demo.component.html',
  imports: [SkyModalModule, SkyTilesModule],
})
export class ModalTiledDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
