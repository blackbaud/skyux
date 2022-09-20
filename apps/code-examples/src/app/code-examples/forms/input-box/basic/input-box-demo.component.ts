import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-input-box-demo',
  templateUrl: './input-box-demo.component.html',
  styleUrls: ['./input-box-demo.component.scss'],
})
export class InputBoxDemoComponent implements OnInit {
  public firstName: UntypedFormControl;
  public lastName: UntypedFormControl;
  public bio: UntypedFormControl;
  public email: UntypedFormControl;
  public dob: UntypedFormControl;
  public newMemberForm: UntypedFormGroup;

  public ngOnInit(): void {
    this.firstName = new UntypedFormControl('');
    this.lastName = new UntypedFormControl('', Validators.required);
    this.bio = new UntypedFormControl('');
    this.email = new UntypedFormControl('', [
      Validators.required,
      SkyValidators.email,
    ]);
    this.dob = new UntypedFormControl('', Validators.required);
    this.newMemberForm = new UntypedFormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      email: this.email,
      dob: this.dob,
    });
  }
}
