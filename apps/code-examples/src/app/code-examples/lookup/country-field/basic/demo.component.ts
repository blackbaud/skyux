import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldModule } from '@skyux/lookup';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent {
  protected countryControl: FormControl;
  protected countryForm: FormGroup;

  constructor() {
    this.countryControl = new FormControl(undefined, {
      validators: this.#validateCountry,
    });

    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au',
    });

    this.countryForm = new FormGroup({
      countryControl: this.countryControl,
    });

    this.countryControl.addValidators([Validators.required]);
  }

  #validateCountry(control: AbstractControl): ValidationErrors | null {
    if (control.value?.name === 'Mexico') {
      return { invalidCountry: true };
    }
    return null;
  }
}
