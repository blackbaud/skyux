import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyFileAttachmentChange } from '@skyux/forms';

@Component({
  selector: 'app-single-file-attachment',
  templateUrl: './single-file-attachment.component.html',
  styleUrls: ['./single-file-attachment.component.scss'],
  standalone: false,
})
export class SingleFileAttachmentComponent {
  public imageAttachment: UntypedFormControl;
  public fileAttachment: UntypedFormControl;
  public attachment: UntypedFormControl;
  public disabled: UntypedFormControl;
  public errored: UntypedFormControl;

  public fileForm: UntypedFormGroup;

  public get reactiveFile(): AbstractControl | null {
    return this.fileForm.get('imageAttachment');
  }

  constructor(formBuilder: UntypedFormBuilder) {
    this.disabled = new UntypedFormControl({
      value: undefined,
      disabled: true,
    });
    this.attachment = new UntypedFormControl(undefined, Validators.required);
    this.imageAttachment = new UntypedFormControl(
      {
        file: {
          name: 'myImage.jpg',
          type: 'image/jpeg',
          size: 976,
        },
        url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCADDAK8DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAgJ/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuwEPs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==',
      },
      Validators.required,
    );
    this.fileAttachment = new UntypedFormControl(
      {
        file: {
          name: 'myFile.txt',
          size: 100,
        },
      },
      Validators.required,
    );
    this.errored = new UntypedFormControl(undefined, Validators.required);
    this.errored.markAsTouched();
    this.fileForm = formBuilder.group({
      attachment: this.attachment,
      attachmentNotRequired: new UntypedFormControl(undefined),
      disabled: this.disabled,
      imageAttachment: this.imageAttachment,
      fileAttachment: this.fileAttachment,
      errored: this.errored,
    });
  }

  public reactiveFileUpdated(result: SkyFileAttachmentChange): void {
    const file = result.file;
    this.reactiveFile?.setValue(file);
  }
}
