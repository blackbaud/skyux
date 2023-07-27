import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  NgModel,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
})
export class InputBoxComponent implements OnInit, AfterViewInit {
  public errorAutofillForm: UntypedFormGroup;

  public errorField: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorNgModelValue: string;

  public myValue = '';

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  public ngOnInit(): void {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.errorField.markAsTouched();

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
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
