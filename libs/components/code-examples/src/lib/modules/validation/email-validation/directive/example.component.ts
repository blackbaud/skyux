import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyEmailValidationModule } from '@skyux/validation';

/**
 * @title Email validation using input directive
 */
@Component({
  selector: 'app-validation-email-validation-directive-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyEmailValidationModule,
    SkyInputBoxModule,
  ],
})
export class ValidationEmailValidationDirectiveExampleComponent {
  protected exampleModel: {
    emailAddress?: string;
  } = {};
}
