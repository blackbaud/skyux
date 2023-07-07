import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
})
export class PhoneFieldComponent {
  public phoneControl: UntypedFormControl;

  public phoneForm: UntypedFormGroup;

  constructor() {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });
  }
}
