import { Component } from '@angular/core';

@Component({
  selector: 'app-test-cmp-modal',
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
