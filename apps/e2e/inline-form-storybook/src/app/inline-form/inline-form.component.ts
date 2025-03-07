import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyInlineFormConfig } from '@skyux/inline-form';

@Component({
  selector: 'app-inline-form',
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
  standalone: false,
})
export class InlineFormComponent {
  public firstName = 'Jane';

  public myForm: FormGroup;

  @Input()
  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: 0,
  };

  public showForm = false;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myFirstName: new FormControl(),
    });
  }

  public onInlineFormOpen(): void {
    this.showForm = true;
    this.myForm.patchValue({
      myFirstName: this.firstName,
    });
  }
}
