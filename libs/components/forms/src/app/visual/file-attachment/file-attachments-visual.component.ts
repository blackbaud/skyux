import { Component } from '@angular/core';

import {
  SkyFileItem,
  SkyFileLink,
  SkyFileDropChange
} from '@blackbaud/skyux/dist/core';

@Component({
  selector: 'file-attachments-visual',
  templateUrl: './file-attachments-visual.component.html'
})
export class FileAttachmentsVisualComponent {
  public filesToUpload: Array<SkyFileItem>;

  public allItems: Array<SkyFileItem | SkyFileLink>;

  public linksToUpload: Array<SkyFileLink>;

  public rejectedFiles: Array<SkyFileItem>;

  public maxFileSize: number = 4000000;

  public acceptedTypes: Array<String>;

  public allowLinks: boolean = true;

  constructor() {
    this.filesToUpload = [];
    this.rejectedFiles = [];
    this.allItems = [<SkyFileItem>{
      file: {
        name: 'myfile.pdf',
        size: 50,
        type: 'pdf'
      }
    }];
    this.linksToUpload = [];
  }

  public filesUpdated(result: SkyFileDropChange) {
    this.filesToUpload = this.filesToUpload.concat(result.files);
    this.rejectedFiles = this.rejectedFiles.concat(result.rejectedFiles);
    this.allItems = this.allItems.concat(result.files);
  }

  public linkAdded(result: SkyFileLink) {
    this.linksToUpload = this.linksToUpload.concat(result);
    this.allItems = this.allItems.concat(result);
  }

  public validateFile(file: SkyFileItem) {
    if (file.file.name.indexOf('a') === 0) {
        return 'You may not upload a file that begins with the letter "a."';
    } else {
      return '';
    }
  }

  public deleteFile(file: SkyFileItem | SkyFileLink) {
    this.removeFromArray(this.allItems, file);
    this.removeFromArray(this.filesToUpload, file);
    this.removeFromArray(this.linksToUpload, file);
  }

  private removeFromArray(items: Array<any>, obj: SkyFileItem | SkyFileLink) {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
}
