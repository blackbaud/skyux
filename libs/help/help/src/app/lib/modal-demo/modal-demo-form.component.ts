import { Component } from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import { SkyModalDemoContext } from './modal-demo-context';

@Component({
  selector: 'sky-modal-demo-form',
  templateUrl: './modal-demo-form.component.html'
})
export class SkyModalDemoFormComponent {
  public title = 'Modal demo form';

  constructor(public context: SkyModalDemoContext, public instance: SkyModalInstance) { }
}
