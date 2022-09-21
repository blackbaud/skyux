import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyFileAttachmentComponent } from '../file-attachment.component';

@Component({
  selector: 'sky-file-attachment-test',
  templateUrl: './file-attachment.component.fixture.html',
})
export class FileAttachmentTestComponent implements OnInit {
  public attachment: UntypedFormControl;

  public fileForm: UntypedFormGroup;

  public labelText = 'Choose file';

  public required = false;

  public showLabel = true;

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent: SkyFileAttachmentComponent;
  public showInlineHelp = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.attachment = new UntypedFormControl(undefined);
    this.fileForm = this.formBuilder.group({
      attachment: this.attachment,
    });
  }
}
