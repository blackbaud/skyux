import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  SkyFileAttachmentChange,
  SkyFileAttachmentClick,
  SkyFileItem,
} from '@skyux/forms';

@Component({
  selector: 'app-single-file-attachment',
  templateUrl: './single-file-attachment.component.html',
  styleUrls: ['./single-file-attachment.component.scss'],
})
export class SingleFileAttachmentComponent {
  public attachment: UntypedFormControl;

  public fileForm: UntypedFormGroup;

  public get reactiveFile(): AbstractControl | null {
    return this.fileForm.get('attachment');
  }

  constructor(formBuilder: UntypedFormBuilder) {
    this.attachment = new UntypedFormControl(undefined, Validators.required);
    this.fileForm = formBuilder.group({
      attachment: this.attachment,
    });
  }

  public fileClick($event: SkyFileAttachmentClick): void {
    const link = document.createElement('a');
    link.download = $event.file.file.name;
    link.href = $event.file.url;
    link.click();
  }

  public reactiveFileUpdated(result: SkyFileAttachmentChange): void {
    const file = result.file;
    this.reactiveFile?.setValue(file);
  }

  public validateFile(file: SkyFileItem): string {
    if (file.file.name.indexOf('a') === 0) {
      return 'You may not upload a file that begins with the letter "a."';
    } else {
      return '';
    }
  }
}
