import { Component } from '@angular/core';
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
export class InlineFormDemoComponent {
  public firstName = 'Jane';

  public myForm: FormGroup;

  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  public showForm = false;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myFirstName: new FormControl(),
    });
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      this.firstName = this.myForm.get('myFirstName')?.value;
    }

    this.showForm = false;
    this.myForm.patchValue({
      myFirstName: undefined,
    });
  }

  public onInlineFormOpen(): void {
    this.showForm = true;
    this.myForm.patchValue({
      myFirstName: this.firstName,
    });
  }
}
