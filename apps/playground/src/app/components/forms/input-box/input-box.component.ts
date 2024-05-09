import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  NgModel,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SKY_FORM_ERRORS_ENABLED } from '@skyux/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
})
export class InputBoxComponent implements OnInit, AfterViewInit {
  public errorAutofillForm: UntypedFormGroup;

  public errorField: UntypedFormControl;

  public customError: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorNgModelValue: string;

  public myValue = '';

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  public ngOnInit(): void {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.customError = new UntypedFormControl('', [
      (control): ValidationErrors | null => {
        console.log(control.value);
        if (control.value !== 'blue') {
          return { blue: true };
        }
        return null;
      },
      Validators.required,
      Validators.maxLength(1),
    ]);

    this.errorField.markAsTouched();

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
      customError: this.customError,
    });
    this.errorAutofillForm = new UntypedFormGroup({
      errorAutofillFormField: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('Bow ties are cool!'),
      ]),
      errorAutofillTextareaFormField: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('Bow ties are cool!'),
      ]),
    });

    this.errorForm.controls['errorFormField'].markAsTouched();
    this.errorAutofillForm.controls['errorAutofillFormField'].markAsTouched();
    this.errorAutofillForm.controls[
      'errorAutofillTextareaFormField'
    ].markAsTouched();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.errorNgModel.control.markAsTouched();
    });
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
