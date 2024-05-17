import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';

import { SkyCheckboxModule } from '../checkbox.module';

@Component({
  standalone: true,
  selector: 'sky-standard-checkbox-group',
  templateUrl: './standard-checkbox-group.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkyCheckboxModule],
})
export class SkyStandardCheckboxGroupComponent {
  #formBuilder: FormBuilder = inject(FormBuilder);

  protected formGroup: FormGroup;
  protected contactMethod: FormGroup;

  public hintText: string | undefined;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public labelHidden = false;
  public required = false;
  public stacked = true;

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

        if (!email.value && !phone.value && !text.value) {
          return { contactMethodRequired: true };
        } else {
          return null;
        }
      },
    );
  }

  protected onSubmit(): void {
    this.formGroup.markAllAsTouched();

    console.log(this.formGroup.value);
  }
}
