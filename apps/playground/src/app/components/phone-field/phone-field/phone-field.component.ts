import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
})
export class PhoneFieldComponent implements OnInit {
  public phoneNumber: string;

  public phoneNumberInputBox: string;

  public phoneForm: FormGroup;

  public phoneControl: FormControl;

  public ngOnInit() {
    this.phoneControl = new FormControl();
    this.phoneForm = new FormGroup({
      phoneControl: this.phoneControl,
    });
  }
}
