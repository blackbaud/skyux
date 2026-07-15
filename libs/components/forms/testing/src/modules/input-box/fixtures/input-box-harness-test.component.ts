import {
  Component,
  inject,
  model,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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

  public easyModeDisabled = model(false);
  public easyModeHelpContent = model<string | TemplateRef<unknown> | undefined>(
    'Help content',
  );
  public easyModeHelpKey = model<string | undefined>(undefined);
  public easyModeHelpTitle = model('Help title');
  public easyModeLabel = model<string | undefined>('Last name (easy mode)');
  public easyModeStacked = model(false);
  public easyModelValue = model('test');
  public easyModeCharacterLimit = model<number | undefined>(undefined);
  public easyModeHintText = model<string | undefined>(undefined);
  public maxDate = new Date('01/01/2100');
  public minDate = new Date('01/01/2000');

  readonly #formBuilder = inject(UntypedFormBuilder);

  constructor() {
    this.myForm = this.#formBuilder.group({
      firstName: new UntypedFormControl('John'),
      lastName: new UntypedFormControl('Doe'),
    });
    this.directiveErrorForm = this.#formBuilder.group({
      easyModeDatepicker: new UntypedFormControl('123'),
      easyModeTimepicker: new UntypedFormControl('abc'),
      easyModePhoneField: new UntypedFormControl('abc'),
    });
  }
}
