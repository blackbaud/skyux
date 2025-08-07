import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  NgModel,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  standalone: false,
})
export class InputBoxComponent implements OnInit, AfterViewInit {
  public errorAutofillForm: UntypedFormGroup;

  public errorField: UntypedFormControl;

  public customError: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorDisabledField: UntypedFormControl;

  public errorNgModelValue: string;

  public helpPopoverContent: string | undefined = "I'm some help content.";

  public helpKey: string | undefined = 'helpKey.html';

  public myValue = '';

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  @ViewChild('errorNgModelDisabled')
  public errorNgModelDisabled: NgModel;

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

    this.errorDisabledField = new UntypedFormControl('', [Validators.required]);
    this.errorDisabledField.markAsTouched();
    this.errorDisabledField.markAsDirty();
    this.errorDisabledField.disable();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.errorNgModel.control.markAsTouched();
      this.errorNgModelDisabled.control.markAsTouched();
    });
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
