import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SkyFileAttachmentChange,
  SkyFileAttachmentClick,
  SkyFileAttachmentModule,
  SkyFileItem,
} from '@skyux/forms';

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
  protected attachment: FormControl;
  protected formGroup: FormGroup;
  protected maxFileSize = 4000000;
  protected customValidationError: string | undefined;

  get #reactiveFile(): AbstractControl | null {
    return this.formGroup.get('attachment');
  }

  constructor() {
    this.attachment = new FormControl(undefined, Validators.required);
    this.formGroup = inject(FormBuilder).group({
      attachment: this.attachment,
    });
  }

  protected onFileChange(result: SkyFileAttachmentChange): void {
    const file = result.file;

    if (file?.errorType) {
      this.#reactiveFile?.setValue(undefined);
    } else {
      this.#reactiveFile?.setValue(file);
    }

    if (file && file.errorType === 'validate') {
      this.customValidationError = file.errorParam;
    } else {
      this.customValidationError = undefined;
    }
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

  protected validateFile(file: SkyFileItem): string {
    return file.file.name.startsWith('a') ? 'invalidStartingLetter' : '';
  }
}
