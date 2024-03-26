import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  #formBuilder: FormBuilder = inject(FormBuilder);

  protected standardCheckboxGroupFormGroup: FormGroup;
  protected iconCheckboxGroupFormGroup: FormGroup;

  constructor() {
    this.standardCheckboxGroupFormGroup = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
    });

    this.standardCheckboxGroupFormGroup.setValidators(
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

    this.standardCheckboxGroupFormGroup.markAsTouched();

    this.iconCheckboxGroupFormGroup = inject(FormBuilder).group({
      bold: new FormControl(false),
      italic: new FormControl(false),
      underline: new FormControl(false),
    });
  }
}
