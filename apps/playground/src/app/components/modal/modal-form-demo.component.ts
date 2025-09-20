import { Component } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal',
  templateUrl: './modal-form-demo.component.html',
  imports: [
    SkyAutocompleteModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
})
export class ModalFormDemoComponent {
  public title = 'Modal form with scroll';
  public showHelp = false;

  public data: { name: string }[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  constructor(public instance: SkyModalInstance) {}
}
