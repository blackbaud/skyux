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
import { SkyCheckboxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkyCheckboxModule],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  #formBuilder: FormBuilder = inject(FormBuilder);

  protected contactMethod: FormGroup;

  constructor() {
    this.contactMethod = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
      });

    this.formGroup = this.#formBuilder.group({
      contactMethod: this.contactMethod,
      terms: new FormControl(false),
    });

    this.contactMethod.setValidators((control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const email = group.controls['email'];
      const phone = group.controls['phone'];
      const text = group.controls['text'];

      if (!email.value && !phone.value && !text.value) {
        return {contactMethodRequired: true}
      } else {
        return null;
      }
    })

  }

  protected onSubmit(): void {
    this.formGroup.markAllAsTouched();

    console.log(this.formGroup.value);
  }
}
