import {
  SkyAutonumericOptions,
  SkyAutonumericOptionsProvider
} from '../../public/public_api';

export class AutonumericVisualOptionsProvider extends SkyAutonumericOptionsProvider {
  constructor() {
    super();
  }

  public getConfig(): SkyAutonumericOptions {
    return {
      decimalPlaces: 5
    };
  }
}
