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

interface DemoForm {
  firstName: FormControl<string>;
}

/**
 * @title Inline form with basic setup
 */
@Component({
  selector: 'app-inline-form-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
  ],
})
export class InlineFormBasicExampleComponent {
  protected firstName = 'Jane';
  public formGroup: FormGroup<DemoForm>;

  protected inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  protected showForm = false;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      firstName: new FormControl<string>('', { nonNullable: true }),
    });
  }

  protected onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      this.firstName = this.formGroup.value.firstName ?? '';
    }

    this.showForm = false;
    this.formGroup.patchValue({
      firstName: undefined,
    });
  }

  protected onInlineFormOpen(): void {
    this.showForm = true;
    this.formGroup.patchValue({
      firstName: this.firstName,
    });
  }
}
