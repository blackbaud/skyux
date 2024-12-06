import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  SkyFileAttachmentChange,
  SkyFileDropChange,
  SkyFileItem,
  SkyFileLink,
} from '@skyux/forms';

@Component({
  selector: 'app-file-attachment-demo',
  templateUrl: './file-attachment.component.html',
})
export class FileAttachmentComponent {
  public acceptedTypes = 'image/png,image/jpeg,application/pdf';

  public allItems: (SkyFileItem | SkyFileLink)[];

  public filesToUpload: SkyFileItem[];

  public linksToUpload: SkyFileLink[];

  public maxFileSize = 4000000;
  public minFileSize = 300000;

  public rejectedFiles: SkyFileItem[];

  protected attachment: FormControl;
  protected formGroup: FormGroup;
  protected required = true;

  get #reactiveFile(): AbstractControl | null {
    return this.formGroup.get('attachment');
  }

  constructor() {
    this.filesToUpload = [];
    this.rejectedFiles = [];
    this.allItems = [];
    this.linksToUpload = [];
    this.formGroup = inject(FormBuilder).group({
      attachment: this.attachment,
    });
  }

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    this.#removeFromArray(this.allItems, file);
    this.#removeFromArray(this.filesToUpload, file);
    this.#removeFromArray(this.linksToUpload, file);
  }

  public filesUpdated(result: SkyFileDropChange): void {
    this.filesToUpload = this.filesToUpload.concat(result.files);
    this.rejectedFiles = result.rejectedFiles;
    this.allItems = this.allItems.concat(result.files);
  }

  public linkAdded(result: SkyFileLink): void {
    this.linksToUpload = this.linksToUpload.concat(result);
    this.allItems = this.allItems.concat(result);
  }

  public validateFile(file: SkyFileItem): string {
    if (file.file.name.indexOf('a') === 0) {
      return 'You may not upload a file that begins with the letter "a."';
    }
  }

  protected onFileChange(result: SkyFileAttachmentChange): void {
    const file = result.file;

    if (file && file.errorType) {
      this.#reactiveFile?.setValue(undefined);
    } else {
      this.#reactiveFile?.setValue(file);
    }
  }

  #removeFromArray(items: any[], obj: SkyFileItem | SkyFileLink): void {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
}
