import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgModel, Validators } from '@angular/forms';

@Component({
  selector: 'sky-input-box-fixture',
  templateUrl: './input-box.component.fixture.html',
})
export class InputBoxFixtureComponent {
  @Input()
  public basicDisabled: boolean | undefined;

  @Input()
  public hasErrors: boolean | undefined;

  @Input()
  public insetIconDisabled: boolean | undefined;

  public errorField: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorNgModelValue: string | undefined;

  @ViewChild('errorNgModel')
  public errorNgModel!: NgModel;

  constructor() {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
    });
  }
}
