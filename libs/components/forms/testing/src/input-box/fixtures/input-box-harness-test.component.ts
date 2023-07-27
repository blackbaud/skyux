import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'test-input-box-harness',
  templateUrl: './input-box-harness-test.component.html',
})
export class InputBoxHarnessTestComponent {
  public myForm: UntypedFormGroup;

  @ViewChild('helpContentTemplate', {
    read: TemplateRef,
  })
  public helpContentTemplate: TemplateRef<unknown> | undefined;

  public easyModeDisabled = false;
  public easyModeHelpContent: string | TemplateRef<unknown> | undefined =
    'Help content';
  public easyModeHelpTitle = 'Help title';
  public easyModeLabel: string | undefined = 'Last name (easy mode)';
  public easyModeStacked = false;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      firstName: new UntypedFormControl('John'),
      lastName: new UntypedFormControl('Doe'),
    });
  }
}
