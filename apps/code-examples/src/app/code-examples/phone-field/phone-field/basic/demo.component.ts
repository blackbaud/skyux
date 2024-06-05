import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

@Component({
  standalone: true,
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
  protected phoneForm: FormGroup;

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.phoneForm = this.#formBuilder.group({
      phoneControl: this.#formBuilder.control(undefined, {
        validators: Validators.required,
      }),
    });
  }
}
