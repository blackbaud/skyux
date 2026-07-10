import { Component, ViewChild, inject, input } from '@angular/core';
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

  public hintText = input<string | undefined>(undefined);

  public labelElementText = input<string | undefined>('Choose file');

  public labelHidden = input(false);

  public labelText = input<string | undefined>(undefined);

  public required = input(false);

  public showLabel = input(true);

  public maxFileSize = input<number | undefined>(undefined);

  public popoverContent = input<string | undefined>(undefined);

  public popoverTitle = input<string | undefined>(undefined);

  public helpKey = input<string | undefined>(undefined);

  public showInlineHelp = input(false);

  public stacked = input<boolean | undefined>(undefined);

  @ViewChild(SkyFileAttachmentComponent)
  public fileAttachmentComponent!: SkyFileAttachmentComponent;

  constructor() {
    this.attachment = new UntypedFormControl(undefined);
    this.fileForm = inject(UntypedFormBuilder).group({
      attachment: this.attachment,
    });
  }
}
