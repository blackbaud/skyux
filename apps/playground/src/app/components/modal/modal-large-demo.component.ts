import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-large',
  templateUrl: './modal-large-demo.component.html',
  providers: [SkyModalService],
})
export class ModalLargeDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
