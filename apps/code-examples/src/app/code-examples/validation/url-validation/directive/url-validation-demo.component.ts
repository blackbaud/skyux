import { Component } from '@angular/core';
import { SkyUrlValidationOptions } from '@skyux/validation';

@Component({
  selector: 'app-url-validation-demo',
  templateUrl: './url-validation-demo.component.html',
})
export class UrlValidationDemoComponent {
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
