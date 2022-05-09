import { Component } from '@angular/core';
import { SkyNumericOptions } from '@skyux/core';

@Component({
  selector: 'app-numeric-demo',
  templateUrl: './numeric-demo.component.html',
})
export class NumericDemoComponent {
  public numericOptions: SkyNumericOptions = {
    digits: 3,
    format: 'currency',
    iso: 'JPY',
  };
}
