import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SkyFileItem, SkyFileLink } from '@skyux/forms';

@Component({
  selector: 'app-file-attachment-demo',
  templateUrl: './file-attachment.component.html',
})
export class FileAttachmentComponent {
  public acceptedTypes = 'image/png,image/jpeg,application/pdf';

  public allItems: (SkyFileItem | SkyFileLink)[];

  public maxFileSize = 4000000;
  public minFileSize = 300000;

  protected attachment: FormControl<(SkyFileItem | SkyFileLink)[]>;
  protected formGroup: FormGroup;
  protected required = true;

  constructor() {
    this.allItems = [];
    this.attachment = new FormControl(undefined, Validators.required);
    this.formGroup = inject(FormBuilder).group({
      attachment: this.attachment,
    });
  }

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    const index = this.attachment.value.indexOf(file);
    if (index !== -1) {
      this.attachment.value.splice(index, 1);
    }
    if (this.attachment.value.length === 0) {
      this.attachment.setValue(null);
    }
  }

  public validateFile(file: SkyFileItem): string {
    if (file.file.name.indexOf('a') === 0) {
      return 'You may not upload a file that begins with the letter "a."';
    }
  }

  public markTouched(): void {
    this.attachment.markAsTouched();
  }

  public setFiles(): void {
    const file: SkyFileItem = {
      file: new File([], 'foo.bar', { type: 'image/png' }),
      url: 'foo.bar.bar',
    };

    const link: SkyFileLink = {
      url: 'foo.foo',
    };

    this.attachment.setValue([file, link]);
  }
}
