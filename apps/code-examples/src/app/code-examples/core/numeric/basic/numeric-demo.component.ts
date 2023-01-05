import { Component, Input } from '@angular/core';
import { SkyNumericOptions } from '@skyux/core';

@Component({
  selector: 'app-numeric-demo',
  templateUrl: './numeric-demo.component.html',
})
export class NumericDemoComponent {
  @Input()
  public defaultValue = 1000000;

  @Input()
  public configuredValue = 1234567;

  @Input()
  public numericOptions: SkyNumericOptions = {
    digits: 3,
    format: 'currency',
    iso: 'JPY',
  };
}
