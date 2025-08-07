import { Component } from '@angular/core';

import { SkyUrlValidationOptions } from '../url-validation-options';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './url-validation-ruleset.component.fixture.html',
  standalone: false,
})
export class UrlValidationRulesetTestComponent {
  public urlValidator: string | undefined;
  public skyUrlValidationOptions: SkyUrlValidationOptions = {
    rulesetVersion: 2,
  };
}
