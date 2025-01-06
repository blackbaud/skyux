import { Component } from '@angular/core';
import { SkyUrlValidationOptions } from '@skyux/validation';

@Component({
  selector: 'app-url-validation-directive',
  templateUrl: './url-validation-directive.component.html',
  standalone: false,
})
export class UrlValidationDirectiveComponent {
  public demoModel: {
    url?: string;
  } = {};

  public skyUrlValidationOptions: SkyUrlValidationOptions = {
    rulesetVersion: 1,
  };

  public toggleRuleset(): void {
    if (this.skyUrlValidationOptions.rulesetVersion === 1) {
      this.skyUrlValidationOptions = {
        rulesetVersion: 2,
      };
    } else if (this.skyUrlValidationOptions.rulesetVersion === 2) {
      this.skyUrlValidationOptions = {
        rulesetVersion: 1,
      };
    }
  }
}
