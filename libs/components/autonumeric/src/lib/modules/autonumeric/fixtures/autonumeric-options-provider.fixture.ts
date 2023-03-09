import { Injectable } from '@angular/core';

import { SkyAutonumericOptions } from '../autonumeric-options';
import { SkyAutonumericOptionsProvider } from '../autonumeric-options-provider';

@Injectable()
export class AutonumericFixtureOptionsProvider extends SkyAutonumericOptionsProvider {
  constructor() {
    super();
  }

  public override getConfig(): SkyAutonumericOptions {
    return {
      currencySymbol: '%',
      decimalPlaces: 5,
    };
  }
}
