import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyFileAttachmentComponent } from '../file-attachment.component';

@Component({
  selector: 'sky-file-attachment-test',
  templateUrl: './file-attachment.component.fixture.html',
})
export class FileAttachmentTestComponent implements OnInit {
  public attachment: FormControl;

  public fileForm: FormGroup;

  public labelText: string = 'Choose file';

  public required: boolean = false;

  public showLabel: boolean = true;

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent: SkyFileAttachmentComponent;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.attachment = new FormControl(undefined);
    this.fileForm = this.formBuilder.group({
      attachment: this.attachment,
    });
  }
}
