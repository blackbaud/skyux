import {
  Component
} from '@angular/core';

import {
  SkyFileDropChange,
  SkyFileItem,
  SkyFileLink
} from '@skyux/forms';

@Component({
  selector: 'app-file-attachment-demo',
  templateUrl: './file-attachment-demo.component.html'
})
export class FileAttachmentDemoComponent {

  public acceptedTypes: string = 'image/png,image/jpeg';

  public allItems: (SkyFileItem | SkyFileLink)[];

  public filesToUpload: SkyFileItem[];

  public linksToUpload: SkyFileLink[];

  public maxFileSize: number = 4000000;

  public rejectedFiles: SkyFileItem[];

  constructor() {
    this.filesToUpload = [];
    this.rejectedFiles = [];
    this.allItems = [];
    this.linksToUpload = [];
  }

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    this.removeFromArray(this.allItems, file);
    this.removeFromArray(this.filesToUpload, file);
    this.removeFromArray(this.linksToUpload, file);
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

  private removeFromArray(items: any[], obj: SkyFileItem | SkyFileLink): void {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }

}
