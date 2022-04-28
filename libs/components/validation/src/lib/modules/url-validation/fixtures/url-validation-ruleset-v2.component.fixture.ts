import { Component } from '@angular/core';

import { SkyURLValidationOptions } from '../models/url-validation-options';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './url-validation-ruleset-v2.component.fixture.html',
})
export class UrlValidationRulesetV2TestComponent {
  public urlValidator: string;
  public skyUrlValidationOptions: SkyURLValidationOptions = {
    rulesetVersion: 2,
  };
}
