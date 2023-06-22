import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';

@Component({
  selector: 'app-inline-form-demo',
  templateUrl: './inline-form-demo.component.html',
})
export class InlineFormDemoComponent implements OnInit {
  public firstName = 'Jane';

  public myForm: FormGroup;

  public inlineFormConfig: SkyInlineFormConfig = {
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

  public showForm = false;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myFirstName: new FormControl(),
    });
  }

  public ngOnInit(): void {
    this.myForm.valueChanges.subscribe(() => {
      if (
        this.inlineFormConfig.buttons &&
        this.inlineFormConfig.buttons[0].disabled !== this.myForm.invalid
      ) {
        this.inlineFormConfig.buttons[0].disabled = this.myForm.invalid;
        this.inlineFormConfig = { ...{}, ...this.inlineFormConfig };
      }
    });
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    switch (args.reason) {
      case 'save':
        this.firstName = this.myForm.get('myFirstName')?.value;
        this.showForm = false;
        break;
      case 'clear':
        this.myForm.get('myFirstName')?.patchValue(undefined);
        break;
      case 'reset':
        this.myForm.get('myFirstName')?.setValue(this.firstName);
        break;
      default:
        this.showForm = false;
        break;
    }
  }

  public onInlineFormOpen(): void {
    this.showForm = true;
    this.myForm.patchValue({
      myFirstName: this.firstName,
    });
  }
}
