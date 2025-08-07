import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
  SkyInlineFormModule,
} from '@skyux/inline-form';

interface DemoForm {
  firstName: FormControl<string>;
}

/**
 * @title Inline form with custom buttons
 */
@Component({
  selector: 'app-inline-form-custom-buttons-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
  ],
})
export class InlineFormCustomButtonsExampleComponent implements OnInit {
  protected firstName = 'Jane';
  public formGroup: FormGroup<DemoForm>;

  protected inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.Custom,
    buttons: [
      {
        action: 'save',
        text: 'Save',
        styleType: 'primary',
      },
      {
        action: 'clear',
        text: 'Clear',
        styleType: 'default',
      },
      {
        action: 'reset',
        text: 'Reset',
        styleType: 'default',
      },
      {
        action: 'cancel',
        text: 'Cancel',
        styleType: 'link',
      },
    ],
  };

  protected showForm = false;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      firstName: new FormControl<string>('', { nonNullable: true }),
    });
  }

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => {
      if (
        this.inlineFormConfig.buttons &&
        this.inlineFormConfig.buttons[0].disabled !== this.formGroup.invalid
      ) {
        this.inlineFormConfig.buttons[0].disabled = this.formGroup.invalid;
        this.inlineFormConfig = { ...{}, ...this.inlineFormConfig };
      }
    });
  }

  protected onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    switch (args.reason) {
      case 'save':
        this.firstName = this.formGroup.value.firstName ?? '';
        this.showForm = false;
        break;

      case 'clear':
        this.formGroup.patchValue({ firstName: '' });
        break;

      case 'reset':
        this.formGroup.setValue({ firstName: this.firstName });
        break;

      default:
        this.showForm = false;
        break;
    }
  }

  protected onInlineFormOpen(): void {
    this.showForm = true;
    this.formGroup.patchValue({
      firstName: this.firstName,
    });
  }
}
