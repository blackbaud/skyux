import {
  SkyAutonumericOptions,
  SkyAutonumericOptionsProvider
} from '../../public';

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
