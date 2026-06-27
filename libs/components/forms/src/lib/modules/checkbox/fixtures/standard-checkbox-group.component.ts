import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { SkyCheckboxGroupHeadingLevel } from '../checkbox-group-heading-level';
import { SkyCheckboxGroupHeadingStyle } from '../checkbox-group-heading-style';
import { SkyCheckboxModule } from '../checkbox.module';

@Component({
  selector: 'sky-standard-checkbox-group',
  templateUrl: './standard-checkbox-group.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyCheckboxModule],
})
export class SkyStandardCheckboxGroupComponent {
  #formBuilder: FormBuilder = inject(FormBuilder);

  public formGroup: FormGroup;
  public contactMethod: FormGroup;

  public helpKey = input<string | undefined>(undefined);
  public helpPopoverContent = input<string | undefined>(undefined);
  public hintText = input<string | undefined>(undefined);
  public headingHidden = input(false);
  public headingLevel = input<SkyCheckboxGroupHeadingLevel | undefined>(3);
  public headingStyle = input<SkyCheckboxGroupHeadingStyle | undefined>(3);
  public required = input<boolean | undefined>(false);
  public stacked = input<boolean | undefined>(true);

  constructor() {
    this.contactMethod = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
    });

    this.formGroup = this.#formBuilder.group({
      contactMethod: this.contactMethod,
    });

    this.contactMethod.setValidators(
      (control: AbstractControl): ValidationErrors | null => {
        const group = control as FormGroup;
        const email = group.controls['email'];
        const phone = group.controls['phone'];
        const text = group.controls['text'];

        if (email.value && !phone.value && !text.value) {
          return { emailOnly: true };
        } else {
          return null;
        }
      },
    );
  }

  public setValidatorOnTextControl(): void {
    this.contactMethod.get('text')?.addValidators(Validators.requiredTrue);
  }

  protected onSubmit(): void {
    this.formGroup.markAllAsTouched();
  }
}
