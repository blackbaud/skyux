import {
  SkyAutonumericOptions
} from 'projects/sky-autonumeric/src/public-api';

import {
  SkyAutonumericOptionsProvider
} from 'projects/sky-autonumeric/src/public-api';

export class AutonumericDemoOptionsProvider extends SkyAutonumericOptionsProvider {

  constructor() {
    super();
  }

  public getConfig(): SkyAutonumericOptions {
    return {
      currencySymbol: ' €',
      currencySymbolPlacement: 's',
      decimalPlaces: 2,
      decimalCharacter: ',',
      digitGroupSeparator: ''
    };
  }
}
