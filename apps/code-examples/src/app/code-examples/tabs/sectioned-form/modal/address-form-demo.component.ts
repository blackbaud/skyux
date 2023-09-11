import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-address-form-demo',
  templateUrl: './address-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormDemoComponent {}
