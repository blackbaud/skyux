import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

/**
 * @title Phone field with basic setup
 */
@Component({
  selector: 'app-phone-field-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPhoneFieldModule,
  ],
})
export class PhoneFieldBasicExampleComponent {
  public phoneForm: FormGroup;
  public phoneControl: FormControl;

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.phoneControl = this.#formBuilder.control(undefined, {
      validators: Validators.required,
    });
    this.phoneForm = this.#formBuilder.group({
      phoneControl: this.phoneControl,
    });
  }
}
