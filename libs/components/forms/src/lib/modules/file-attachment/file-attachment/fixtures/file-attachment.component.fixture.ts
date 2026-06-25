import { Component, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyFileAttachmentComponent } from '../file-attachment.component';
import { SkyFileAttachmentModule } from '../file-attachment.module';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFileAttachmentModule,
    SkyHelpInlineModule,
  ],
  selector: 'sky-file-attachment-test',
  templateUrl: './file-attachment.component.fixture.html',
})
export class FileAttachmentTestComponent {
  public attachment: UntypedFormControl;

  public fileForm: UntypedFormGroup;

  public hintText: string | undefined;

  public labelElementText: string | undefined = 'Choose file';

  public labelHidden = false;

  public labelText: string | undefined;

  public required = false;

  public showLabel = true;

  public maxFileSize: number | undefined;

  public popoverContent: string | undefined;

  public popoverTitle: string | undefined;

  public helpKey: string | undefined;

  public showInlineHelp = false;

  public stacked: boolean | undefined;

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent!: SkyFileAttachmentComponent;

  constructor(formBuilder: UntypedFormBuilder) {
    this.attachment = new UntypedFormControl(undefined);
    this.fileForm = formBuilder.group({
      attachment: this.attachment,
    });
  }
}
