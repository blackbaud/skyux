import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from 'projects/inline-form/src/public-api';

@Component({
  selector: 'app-inline-form-demo',
  templateUrl: './inline-form-demo.component.html'
})
export class InlineFormDemoComponent implements OnInit {

  public firstName: string = 'Jane';

  public myForm: FormGroup;

  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.Custom,
    buttons: [
      {
        action: 'save',
        text: 'Save',
        styleType: 'primary'
      },
      {
        action: 'delete',
        text: 'Delete',
        styleType: 'default'
      },
      {
        action: 'reset',
        text: 'Reset',
        styleType: 'default'
      },
      {
        action: 'cancel',
        text: 'Cancel',
        styleType: 'link'
      }
    ]
  };

  public showForm: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myFirstName: new FormControl()
    });

    this.myForm.valueChanges.subscribe(() => {
      if (this.inlineFormConfig.buttons[0].disabled !== this.myForm.invalid) {
        this.inlineFormConfig.buttons[0].disabled = this.myForm.invalid;
        this.inlineFormConfig = {...{ }, ...this.inlineFormConfig};
      }
    });
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      this.firstName = this.myForm.get('myFirstName').value;
    }

    this.showForm = false;
    this.myForm.patchValue({
      myFirstName: undefined
    });
  }

  public onInlineFormOpen(): void {
    this.showForm = true;
    this.myForm.patchValue({
      myFirstName: this.firstName
    });
  }

}
