import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-fullpage',
  templateUrl: './modal-fullpage-demo.component.html',
  providers: [SkyModalService],
})
export class ModalFullPageDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
