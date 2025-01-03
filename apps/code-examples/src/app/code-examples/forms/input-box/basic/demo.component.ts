import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class DemoComponent {
  protected favoriteColor: FormControl<string | null>;

  protected formGroup: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    bio: FormControl<string | null>;
    email: FormControl<string | null>;
    dob: FormControl<string | null>;
    favoriteColor: FormControl<string | null>;
  }>;

  constructor() {
    this.favoriteColor = new FormControl('none', [
      (control): ValidationErrors | null => {
        if (control.value === 'invalid') {
          return { invalid: true };
        }

        return null;
      },
    ]);

    this.formGroup = inject(FormBuilder).group({
      firstName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      bio: new FormControl(''),
      email: new FormControl('', [Validators.required, SkyValidators.email]),
      dob: new FormControl('', Validators.required),
      favoriteColor: this.favoriteColor,
    });
  }
}
