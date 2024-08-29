import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import {
  NgModel,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { InputBoxHostServiceFixtureComponent } from './input-box-host-service.component.fixture';

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
  public autocomplete: string | undefined;

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

  public easyModeValue: string | undefined;

  public easyModeCharacterLimit: number | undefined = 10;

  public easyModeStacked: boolean | undefined = true;

  public easyModeHelpPopoverContent: TemplateRef<unknown> | string | undefined =
    'Help content from text';

  public easyModeHelpKey: string | undefined;

  public easyModeHintText: string | undefined;

  public easyModeAriaDescribedBy: string | undefined;

  @ViewChild('errorNgModel')
  public errorNgModel!: NgModel;

  @ViewChild('easyModePopoverTemplate', { read: TemplateRef })
  public easyModePopoverTemplate: TemplateRef<unknown> | undefined;

  @ViewChild(InputBoxHostServiceFixtureComponent)
  public inputBoxHostServiceComponent:
    | InputBoxHostServiceFixtureComponent
    | undefined;

  constructor() {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.errorStatusIndicatorField = new UntypedFormControl('', [
      Validators.required,
    ]);

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
    });
  }

  public removeErrorFormRequiredValidator(): void {
    this.errorField.removeValidators(Validators.required);
  }
}
