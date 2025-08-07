import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyUrlValidationModule,
  SkyUrlValidationOptions,
} from '@skyux/validation';

/**
 * @title URL validation using input directive
 */
@Component({
  selector: 'app-validation-url-validation-directive-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyUrlValidationModule,
  ],
})
export class ValidationUrlValidationDirectiveExampleComponent {
  protected exampleModel: {
    url?: string;
  } = {};

  protected skyUrlValidationOptions: SkyUrlValidationOptions = {
    rulesetVersion: 2,
  };
}
