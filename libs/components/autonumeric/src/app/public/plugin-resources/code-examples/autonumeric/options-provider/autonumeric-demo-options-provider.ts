import {
  SkyAutonumericOptions,
  SkyAutonumericOptionsProvider
} from '@skyux/autonumeric';

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
