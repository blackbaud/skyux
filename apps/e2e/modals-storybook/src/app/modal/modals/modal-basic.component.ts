import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-basic.component.html',
})
export class ModalBasicComponent {
  public showHelp = false;
  public title = 'Hello world';
}
