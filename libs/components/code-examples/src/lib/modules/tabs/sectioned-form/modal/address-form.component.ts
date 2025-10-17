import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-address-form',
  template: `<div>Address form</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent {}
