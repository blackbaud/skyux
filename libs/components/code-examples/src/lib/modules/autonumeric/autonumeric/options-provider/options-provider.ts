import { Injectable } from '@angular/core';
import {
  SkyAutonumericOptions,
  SkyAutonumericOptionsProvider,
} from '@skyux/autonumeric';

@Injectable()
export class DemoAutonumericOptionsProvider extends SkyAutonumericOptionsProvider {
  constructor() {
    super();
  }

  public override getConfig(): SkyAutonumericOptions {
    return {
      currencySymbol: ' €',
      currencySymbolPlacement: 's',
      decimalPlaces: 2,
      decimalCharacter: ',',
      digitGroupSeparator: '',
    };
  }
}
