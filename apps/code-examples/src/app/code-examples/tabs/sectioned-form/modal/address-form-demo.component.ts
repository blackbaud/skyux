import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-address-form-demo',
  templateUrl: './address-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AddressFormDemoComponent {}
