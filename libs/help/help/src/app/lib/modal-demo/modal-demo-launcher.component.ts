import { Component } from '@angular/core';

import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';

import { SkyModalDemoContext } from './modal-demo-context';

import { SkyModalDemoFormComponent } from './modal-demo-form.component';

@Component({
  selector: 'sky-modal-demo-launcher',
  templateUrl: './modal-demo-launcher.component.html'
})
export class SkyModalDemoComponent {
  constructor(private modal: SkyModalService) { }

  public openModal() {
    let context = new SkyModalDemoContext();
    context.valueA = 'Default text';

    let modalInstance = this.modal.open(SkyModalDemoFormComponent, {
      providers: [
        {
          provide: SkyModalDemoContext, useValue: context
        }
      ]
    });

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      console.log('Modal closed with reason: ' + result.reason + ' and data: ' + result.data);
    });
  }
}
