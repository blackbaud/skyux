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
  SkyFileAttachmentsModule,
  SkyFileItem,
} from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
  ],
})
export class DemoComponent {
  protected attachment: FormControl;
  protected formGroup: FormGroup;
  protected maxFileSize = 4000000;
  protected reactiveUploadError: string | undefined;

  get #reactiveFile(): AbstractControl | null {
    return this.formGroup.get('attachment');
  }

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.attachment = new FormControl(undefined, Validators.required);
    this.formGroup = this.#formBuilder.group({
      attachment: this.attachment,
    });
  }

  protected onFileChange(result: SkyFileAttachmentChange): void {
    const file = result.file;

    if (file && file.errorType) {
      this.#reactiveFile?.setValue(undefined);
      this.reactiveUploadError = this.#getErrorMessage(
        file.errorType,
        file.errorParam
      );
    } else {
      this.#reactiveFile?.setValue(file);
      this.reactiveUploadError = undefined;
    }
  }

  protected onFileClick($event: SkyFileAttachmentClick): void {
    const link = document.createElement('a');
    link.download = $event.file.file.name;
    link.href = $event.file.url;
    link.click();
  }

  protected onHelpClick(): void {
    alert('Help inline button clicked!');
  }

  protected validateFile(file: SkyFileItem): string {
    return file.file.name.indexOf('a') === 0
      ? 'You may not upload a file that begins with the letter "a."'
      : '';
  }

  #getErrorMessage(errorType: string, errorParam?: string): string | undefined {
    if (errorType === 'fileType') {
      return `Please upload a file of type ${errorParam}.`;
    } else if (errorType === 'maxFileSize') {
      return `Please upload a file smaller than ${errorParam} KB.`;
    } else {
      return errorParam;
    }
  }
}
