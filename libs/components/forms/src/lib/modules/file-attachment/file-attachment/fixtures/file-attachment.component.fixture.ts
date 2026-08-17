import { Component, ViewChild, inject, input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyFileAttachmentComponent } from '../file-attachment.component';
import { SkyFileAttachmentModule } from '../file-attachment.module';

@Component({
  imports: [FormsModule, ReactiveFormsModule, SkyFileAttachmentModule],
  selector: 'sky-file-attachment-test',
  templateUrl: './file-attachment.component.fixture.html',
})
export class FileAttachmentTestComponent {
  public attachment: UntypedFormControl;

  public fileForm: UntypedFormGroup;

  public hintText = input<string | undefined>(undefined);

  public labelHidden = input(false);

  public labelText = input<string | undefined>(undefined);

  public required = input(false);

  public maxFileSize = input<number | undefined>(undefined);

  public popoverContent = input<string | undefined>(undefined);

  public popoverTitle = input<string | undefined>(undefined);

  public helpKey = input<string | undefined>(undefined);

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
