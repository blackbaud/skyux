import { Component } from '@angular/core';

import { SkyModalInstance } from '../../public';

@Component({
  selector: 'sky-test-cmp-modal-content',
  templateUrl: './modal-content-demo.component.html'
})
export class ModalContentDemoComponent {

  constructor(public instance: SkyModalInstance) {}
}
