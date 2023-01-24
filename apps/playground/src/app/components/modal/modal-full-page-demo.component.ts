import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-full-page',
  templateUrl: './modal-full-page-demo.component.html',
  providers: [SkyModalService],
})
export class ModalFullPageDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
