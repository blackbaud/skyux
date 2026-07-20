import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
  inject,
  input,
  model,
} from '@angular/core';
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
  standalone: false,
})
export class InputBoxFixtureComponent {
  public a11yInsetIconLeft = input(false);

  public a11yInsetIcon = input(false);

  public a11yButtonLeft = input(false);

  public a11yInsetButton = input(false);

  public a11yNormalButton = input(false);

  public autocomplete = input<string | undefined>(undefined);

  public basicDisabled = input<boolean | undefined>(undefined);

  public characterCountHelp = input(false);

  public hasErrors = input<boolean | undefined>(undefined);

  public inlineHelpType = input<'custom' | 'sky'>('custom');

  public insetIconDisabled = input<boolean | undefined>(undefined);

  public labelText = input<string | undefined>('Easy mode');

  public errorField: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorStatusIndicatorField: UntypedFormControl;

  public errorNgModelValue: string | undefined;

  public easyModeValue = model<string | undefined>(undefined);

  public easyModeCharacterLimit = input<number | undefined>(10);

  public easyModeStacked = input<boolean | undefined>(true);

  public easyModeHelpPopoverContent = input<
    TemplateRef<unknown> | string | undefined
  >('Help content from text');

  public easyModeHelpKey = input<string | undefined>(undefined);

  public easyModeHintText = input<string | undefined>(undefined);

  public easyModeAriaDescribedBy = input<string | undefined>(undefined);

  @ViewChild('errorNgModel')
  public errorNgModel!: NgModel;

  @ViewChild('easyModePopoverTemplate', { read: TemplateRef })
  public easyModePopoverTemplate: TemplateRef<unknown> | undefined;

  @ViewChild(InputBoxHostServiceFixtureComponent)
  public inputBoxHostServiceComponent:
    InputBoxHostServiceFixtureComponent | undefined;

  constructor() {
    const cdr = inject(ChangeDetectorRef);

    this.errorField = new UntypedFormControl('', [Validators.required]);
    this.errorField.statusChanges.subscribe(() => cdr.markForCheck());

    this.errorStatusIndicatorField = new UntypedFormControl('', [
      Validators.required,
    ]);
    this.errorStatusIndicatorField.statusChanges.subscribe(() =>
      cdr.markForCheck(),
    );

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
    });
    this.errorForm.statusChanges.subscribe(() => cdr.markForCheck());
  }

  public removeErrorFormRequiredValidator(): void {
    this.errorField.removeValidators(Validators.required);
    this.errorField.updateValueAndValidity();
  }
}
