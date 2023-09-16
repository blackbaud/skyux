import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
  SkyInlineFormModule,
} from '@skyux/inline-form';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent implements OnInit {
  protected firstName = 'Jane';
  protected formGroup: FormGroup;

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

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      myFirstName: new FormControl(),
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
        this.firstName = this.formGroup.get('myFirstName')?.value;
        this.showForm = false;
        break;

      case 'clear':
        this.formGroup.get('myFirstName')?.patchValue(undefined);
        break;

      case 'reset':
        this.formGroup.get('myFirstName')?.setValue(this.firstName);
        break;

      default:
        this.showForm = false;
        break;
    }
  }

  protected onInlineFormOpen(): void {
    this.showForm = true;
    this.formGroup.patchValue({
      myFirstName: this.firstName,
    });
  }
}
