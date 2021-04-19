import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyFileAttachmentChange,
  SkyFileAttachmentClick,
  SkyFileItem
} from '@skyux/forms';

@Component({
  selector: 'app-single-file-attachment-docs',
  templateUrl: './single-file-attachment-docs.component.html'
})
export class SingleFileAttachmentDocsComponent implements OnInit {

  public attachment: FormControl;

  public fileForm: FormGroup;

  public maxFileSize: number = 4000000;

  public get reactiveFile(): AbstractControl {
    return this.fileForm.get('attachment');
  }

  public reactiveUploadError: string;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.attachment = new FormControl(undefined, Validators.required);
    this.fileForm = this.formBuilder.group({
      attachment: this.attachment
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

    if (file && file.errorType) {
      this.reactiveFile.setValue(undefined);
      this.reactiveUploadError = this.getErrorMessage(file.errorType, file.errorParam);

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
