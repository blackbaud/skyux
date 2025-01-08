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

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPhoneFieldModule,
  ],
})
export class DemoComponent {
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
