import { Component, OnInit } from '@angular/core';
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
  standalone: false,
})
export class SingleFileAttachmentComponent implements OnInit {
  public attachment: UntypedFormControl;

  public fileForm: UntypedFormGroup;

  public maxFileSize = 4000000;

  public get reactiveFile(): AbstractControl {
    return this.fileForm.get('attachment');
  }

  public reactiveUploadError: string;

  public helpKey: string | undefined;

  protected hintText = 'Please upload a file.';

  constructor(private formBuilder: UntypedFormBuilder) {}

  public fileClick($event: SkyFileAttachmentClick): void {
    const link = document.createElement('a');
    link.download = $event.file.file.name;
    link.href = $event.file.url;
    link.click();
  }

  public ngOnInit(): void {
    this.attachment = new UntypedFormControl(undefined, Validators.required);
    this.fileForm = this.formBuilder.group({
      attachment: this.attachment,
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }

  public reactiveFileUpdated(result: SkyFileAttachmentChange): void {
    const file = result.file;

    if (file && file.errorType) {
      this.reactiveFile.setValue(undefined);
      this.reactiveUploadError = this.getErrorMessage(
        file.errorType,
        file.errorParam,
      );
    } else {
      this.reactiveFile.setValue(file);
      this.reactiveUploadError = undefined;
    }
  }

  public validateFile(file: SkyFileItem): string {
    if (file.file.name.indexOf('a') === 0) {
      return 'You may not upload a file that begins with the letter "a."';
    } else {
      return '';
    }
  }

  private getErrorMessage(errorType: string, errorParam: string): string {
    if (errorType === 'fileType') {
      return `Please upload a file of type ${errorParam}.`;
    } else if (errorType === 'maxFileSize') {
      return `Please upload a file smaller than ${errorParam} KB.`;
    } else {
      return errorParam;
    }
  }
}
