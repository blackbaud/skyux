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
export class InputBoxComponent implements AfterViewInit, OnInit {
  public errorField: UntypedFormControl | undefined;

  public errorForm: UntypedFormGroup | undefined;

  public errorNgModelValue = '';

  public myValue = 'Value';

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel | undefined;

  public ngOnInit(): void {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.errorField.markAsTouched();

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
    });

    this.errorForm.controls['errorFormField'].markAsTouched();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.errorNgModel?.control.markAsTouched();
    });
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
