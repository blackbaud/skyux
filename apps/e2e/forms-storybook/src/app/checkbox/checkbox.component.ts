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
  standalone: false,
})
export class CheckboxComponent {
  #formBuilder: FormBuilder = inject(FormBuilder);

  protected checkboxGroupFormGroup: FormGroup;
  protected standardCheckboxGroupFormGroup1: FormGroup;
  protected standardCheckboxGroupFormGroup2: FormGroup;
  protected standardCheckboxGroupFormGroup3: FormGroup;
  protected standardCheckboxGroupFormGroup4: FormGroup;
  protected iconCheckboxGroupFormGroup: FormGroup;

  constructor() {
    this.standardCheckboxGroupFormGroup1 = this.#formBuilder.group({
      email: new FormControl(true),
      phone: new FormControl(false),
      text: new FormControl(false),
    });

    this.standardCheckboxGroupFormGroup2 = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
    });

    this.standardCheckboxGroupFormGroup3 = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
    });

    this.standardCheckboxGroupFormGroup4 = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
    });

    this.checkboxGroupFormGroup = this.#formBuilder.group({
      standardCheckboxGroupFormGroup1: this.standardCheckboxGroupFormGroup1,
      standardCheckboxGroupFormGroup2: this.standardCheckboxGroupFormGroup2,
      standardCheckboxGroupFormGroup3: this.standardCheckboxGroupFormGroup3,
      standardCheckboxGroupFormGroup4: this.standardCheckboxGroupFormGroup4,
    });

    this.standardCheckboxGroupFormGroup1.setValidators(
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

    this.standardCheckboxGroupFormGroup1.markAsTouched();
    this.standardCheckboxGroupFormGroup2.markAsTouched();

    this.iconCheckboxGroupFormGroup = this.#formBuilder.group({
      bold: new FormControl(false),
      italic: new FormControl(false),
      underline: new FormControl(false),
    });
  }
}
