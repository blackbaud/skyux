import { CommonModule } from '@angular/common';
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
  SkyFileAttachmentChange,
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

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFileAttachmentModule,
  ],
})
export class DemoComponent {
  protected attachmentControl: FormControl<SkyFileItem | null | undefined>;

  protected formGroup: FormGroup<{
    attachment: FormControl<SkyFileItem | null | undefined>;
  }>;

  protected maxFileSize = 4000000;

  constructor() {
    this.attachmentControl = new FormControl(undefined, {
      validators: [Validators.required, customValidator],
    });

    this.formGroup = inject(FormBuilder).group({
      attachment: this.attachmentControl,
    });
  }

  protected onFileChange(result: SkyFileAttachmentChange): void {}

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
