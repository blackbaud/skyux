import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'test-input-box-harness',
  templateUrl: './input-box-harness-test.component.html',
  standalone: false,
})
export class InputBoxHarnessTestComponent {
  public myForm: UntypedFormGroup;
  public directiveErrorForm: UntypedFormGroup;

  @ViewChild('helpContentTemplate', {
    read: TemplateRef,
  })
  public helpContentTemplate: TemplateRef<unknown> | undefined;

  public easyModeDisabled = false;
  public easyModeHelpContent: string | TemplateRef<unknown> | undefined =
    'Help content';
  public easyModeHelpKey: string | undefined;
  public easyModeHelpTitle = 'Help title';
  public easyModeLabel: string | undefined = 'Last name (easy mode)';
  public easyModeStacked = false;
  public easyModelValue = 'test';
  public easyModeCharacterLimit: number | undefined;
  public easyModeHintText: string | undefined;
  public maxDate = new Date('01/01/2100');
  public minDate = new Date('01/01/2000');

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      firstName: new UntypedFormControl('John'),
      lastName: new UntypedFormControl('Doe'),
    });
    this.directiveErrorForm = formBuilder.group({
      easyModeDatepicker: new UntypedFormControl('123'),
      easyModeTimepicker: new UntypedFormControl('abc'),
      easyModePhoneField: new UntypedFormControl('abc'),
    });
  }
}
