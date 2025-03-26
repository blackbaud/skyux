import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  SkyFileAttachmentClick,
  SkyFileAttachmentModule,
  SkyFileItem,
} from '@skyux/forms';

/**
 * Demonstrates how to create a custom validator function for your form control.
 */
function customValidator(
  control: AbstractControl<SkyFileItem | null | undefined>,
): ValidationErrors | null {
  const fileItem = control.value;

  return fileItem?.file?.name.startsWith('a')
    ? { invalidStartingLetter: true }
    : null;
}

/**
 * @title File attachment with basic setup
 */
@Component({
  selector: 'app-forms-file-attachment-basic-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyFileAttachmentModule],
})
export class FormsFileAttachmentBasicExampleComponent {
  protected attachment: FormControl<SkyFileItem | null | undefined>;

  protected formGroup: FormGroup<{
    attachment: FormControl<SkyFileItem | null | undefined>;
  }>;

  protected maxFileSize = 4000000;

  constructor() {
    this.attachment = new FormControl(undefined, {
      validators: [Validators.required, customValidator],
    });

    this.formGroup = inject(FormBuilder).group({
      attachment: this.attachment,
    });
  }

  protected onFileClick($event: SkyFileAttachmentClick): void {
    // Ensure we are only attempting to navigate to locally updated data for download.
    if ($event.file.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.download = $event.file.file.name;
      link.href = $event.file.url;
      link.click();
    }
  }
}
