import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-input-box-demo',
  templateUrl: './input-box-demo.component.html',
  styleUrls: ['./input-box-demo.component.scss'],
})
export class InputBoxDemoComponent {
  public firstName: FormControl<string | null>;
  public lastName: FormControl<string | null>;
  public bio: FormControl<string | null>;
  public email: FormControl<string | null>;
  public dob: FormControl<string | null>;
  public favoriteColor: FormControl<string | null>;

  public newMemberForm: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    bio: FormControl<string | null>;
    email: FormControl<string | null>;
    dob: FormControl<string | null>;
    favoriteColor: FormControl<string | null>;
  }>;

  constructor() {
    this.firstName = new FormControl('');
    this.lastName = new FormControl('', Validators.required);
    this.bio = new FormControl('');
    this.email = new FormControl('', [
      Validators.required,
      SkyValidators.email,
    ]);
    this.dob = new FormControl('', Validators.required);
    this.favoriteColor = new FormControl('none');

    this.newMemberForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      email: this.email,
      dob: this.dob,
      favoriteColor: this.favoriteColor,
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
