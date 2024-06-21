import { Component, inject } from '@angular/core';
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
export class DemoComponent {
  protected firstName = 'Jane';
  protected formGroup: FormGroup;

  protected inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  protected showForm = false;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      myFirstName: new FormControl(),
    });
  }

  protected onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      this.firstName = this.formGroup.get('myFirstName')?.value;
    }

    this.showForm = false;
    this.formGroup.patchValue({
      myFirstName: undefined,
    });
  }

  protected onInlineFormOpen(): void {
    this.showForm = true;
    this.formGroup.patchValue({
      myFirstName: this.firstName,
    });
  }
}
