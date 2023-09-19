import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
  protected labelText = 'Country';

  constructor() {
    this.countryControl = new FormControl();

    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au',
    });

    this.countryForm = new FormGroup({
      countryControl: this.countryControl,
    });

    this.countryControl.setValidators([Validators.required]);
  }
}
