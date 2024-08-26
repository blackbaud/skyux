import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgModelGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styles: [
    `
      .im-special {
        margin-left: calc(var(--sky-switch-size) + var(--sky-switch-margin));
      }
    `,
  ],
})
export class CheckboxComponent implements OnInit {
  public checkValue = true;

  public foo: boolean;

  public bar: boolean;

  public indeterminate = false;

  public reactiveFormGroup: UntypedFormGroup;

  public required = true;

  public showInlineHelp = false;

  @ViewChild('templateFormGroup', { static: true })
  protected templateFormGroup: NgModelGroup | undefined;

  protected formGroup: FormGroup;
  protected contactMethod: FormGroup;

  protected model = {
    email: false,
    phone: false,
    text: false,
  };

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
      reactiveCheckbox: new FormControl(undefined, [Validators.requiredTrue]),
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

  protected onSubmitContactMethod(): void {
    this.contactMethod.markAsDirty();
    this.contactMethod.markAsTouched();

    this.templateFormGroup.control.markAsDirty();
    this.templateFormGroup.control.markAsTouched();
  }
}
