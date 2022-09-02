import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal',
  templateUrl: './modal-demo.component.html',
  providers: [SkyModalService],
})
export class ModalDemoComponent {
  public title = 'Hello world';
}
