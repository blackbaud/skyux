import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-input-box-demo',
  templateUrl: './input-box-demo.component.html',
})
export class InputBoxDemoComponent implements OnInit {
  public firstName: FormControl;
  public lastName: FormControl;
  public bio: FormControl;
  public email: FormControl;
  public dob: FormControl;
  public newMemberForm: FormGroup;

  public ngOnInit() {
    this.firstName = new FormControl('');
    this.lastName = new FormControl('', Validators.required);
    this.bio = new FormControl('');
    this.email = new FormControl('', [
      Validators.required,
      SkyValidators.email,
    ]);
    this.dob = new FormControl('', Validators.required);
    this.newMemberForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      email: this.email,
      dob: this.dob,
    });
  }
}
