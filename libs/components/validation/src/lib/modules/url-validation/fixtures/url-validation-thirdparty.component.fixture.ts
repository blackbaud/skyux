import { Component } from '@angular/core';

import { SkyURLValidationOptions } from '../types/url-validation-options';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './url-validation.component.fixture.html',
})
export class UrlValidationThirdPartyTestComponent {
  public urlValidator: string;
  public skyURLValidationOptions: SkyURLValidationOptions = {
    useValidatorLibrary: true,
  };

  constructor() {
    console.log(
      'skyURLValidationOptions in Fixture constructor:',
      this.skyURLValidationOptions
    );
  }
}
