import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-email-validation-demo',
  templateUrl: './email-validation-demo.component.html',
})
export class EmailValidationDemoComponent implements OnInit {
  public get emailControl(): AbstractControl {
    return this.formGroup.get('email');
  }

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: new FormControl(undefined, [
        Validators.required,
        SkyValidators.email,
      ]),
    });
  }
}
