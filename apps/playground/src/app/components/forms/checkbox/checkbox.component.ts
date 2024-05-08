import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent implements OnInit {
  public checkValue = true;

  public foo: boolean;

  public bar: boolean;

  public indeterminate = false;

  public reactiveFormGroup: UntypedFormGroup;

  public required = true;

  public showInlineHelp = false;

  protected agreeToTerms = false;
  protected formGroup: FormGroup;
  protected contactMethod: FormGroup;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;

    this.contactMethod = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false, [Validators.requiredTrue]),
      text: new FormControl(false),
    });

    this.formGroup = this.#formBuilder.group({
      contactMethod: this.contactMethod,
      terms: new FormControl(false),
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

  public ngOnInit(): void {
    this.reactiveFormGroup = this.#formBuilder.group({
      reactiveCheckbox: new FormControl(undefined),
    });
  }

  public toggleIndeterminate(): void {
    this.indeterminate = !this.indeterminate;
  }

  public toggleRequired(): void {
    this.required = !this.required;
  }

  public toggleInlineHelp(): void {
    this.showInlineHelp = !this.showInlineHelp;
  }

  protected onSubmit(): void {
    this.contactMethod.markAsDirty();
    this.contactMethod.markAsTouched();
  }
}
