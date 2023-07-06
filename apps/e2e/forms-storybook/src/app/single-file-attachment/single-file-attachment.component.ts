import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyFileAttachmentChange, SkyFileItem } from '@skyux/forms';

@Component({
  selector: 'app-single-file-attachment',
  templateUrl: './single-file-attachment.component.html',
  styleUrls: ['./single-file-attachment.component.scss'],
})
export class SingleFileAttachmentComponent {
  @Input()
  public set uploadedFiles(value: SkyFileItem) {
    this.reactiveFileUpdated({ file: value });
    this.showStatesFlag = false;
  }

  public showStatesFlag = true;

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

  public reactiveFileUpdated(result: SkyFileAttachmentChange): void {
    const file = result.file;
    this.reactiveFile?.setValue(file);
  }
}
