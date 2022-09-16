import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyFileAttachmentComponent } from '../file-attachment.component';

@Component({
  selector: 'sky-file-attachment-test',
  templateUrl: './file-attachment.component.fixture.html',
})
export class FileAttachmentTestComponent {
  public attachment: FormControl;

  public fileForm: FormGroup;

  public labelText = 'Choose file';

  public required = false;

  public showLabel = true;

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent!: SkyFileAttachmentComponent;
  public showInlineHelp = false;

  constructor(formBuilder: FormBuilder) {
    this.attachment = new FormControl(undefined);
    this.fileForm = formBuilder.group({
      attachment: this.attachment,
    });
  }
}
