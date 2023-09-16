import { CommonModule } from '@angular/common';
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
import { SkyIdModule } from '@skyux/core';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyHelpInlineModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyValidators } from '@skyux/validation';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyFluidGridModule,
    SkyHelpInlineModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class DemoComponent {
  protected dob = new FormControl('', Validators.required);
  protected email = new FormControl('', [
    Validators.required,
    SkyValidators.email,
  ]);
  protected favoriteColor = new FormControl('none', [
    (control): ValidationErrors | null => {
      if (control.value === 'bird') {
        return {
          color: {
            invalid: true,
            message: 'Bird is not a color.',
          },
        };
      }

      return null;
    },
  ]);

  protected lastName = new FormControl('', Validators.required);

  protected formGroup: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    bio: FormControl<string | null>;
    email: FormControl<string | null>;
    dob: FormControl<string | null>;
    favoriteColor: FormControl<string | null>;
  }>;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      firstName: new FormControl(''),
      lastName: this.lastName,
      bio: new FormControl(''),
      email: this.email,
      dob: this.dob,
      favoriteColor: this.favoriteColor,
    });
  }

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
