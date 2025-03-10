import { Component, Input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyDescriptionListModule } from '@skyux/layout';

/**
 * @title Numeric pipe with basic setup
 */
@Component({
  selector: 'app-core-numeric-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyDescriptionListModule, SkyNumericModule],
})
export class CoreNumericBasicExampleComponent {
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
