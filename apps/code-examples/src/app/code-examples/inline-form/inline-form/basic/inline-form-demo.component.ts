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
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  public showForm = false;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myFirstName: new FormControl(),
    });
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      this.firstName = this.myForm.get('myFirstName').value;
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
