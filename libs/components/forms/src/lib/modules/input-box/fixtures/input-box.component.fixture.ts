import { Component, Input, ViewChild } from '@angular/core';
import {
  NgModel,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'sky-input-box-fixture',
  templateUrl: './input-box.component.fixture.html',
})
export class InputBoxFixtureComponent {
  @Input()
  public a11yInsetIconLeft = false;

  @Input()
  public a11yInsetIcon = false;

  @Input()
  public a11yButtonLeft = false;

  @Input()
  public a11yInsetButton = false;

  @Input()
  public a11yNormalButton = false;

  @Input()
  public basicDisabled: boolean | undefined;

  @Input()
  public characterCountHelp = false;

  @Input()
  public hasErrors: boolean | undefined;

  @Input()
  public inlineHelpType: 'custom' | 'sky' = 'custom';

  @Input()
  public insetIconDisabled: boolean | undefined;

  public errorField: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorStatusIndicatorField: UntypedFormControl;

  public errorNgModelValue: string | undefined;

  @ViewChild('errorNgModel')
  public errorNgModel!: NgModel;

  constructor() {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.errorStatusIndicatorField = new UntypedFormControl('', [
      Validators.required,
    ]);

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
    });
  }
}
