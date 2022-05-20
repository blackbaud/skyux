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
    rulesetVersion: 2,
  };
}
