import { Component, Input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDescriptionListModule, SkyNumericModule],
})
export class DemoComponent {
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
