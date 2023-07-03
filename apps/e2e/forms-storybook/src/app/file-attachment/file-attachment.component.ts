import { Component, Input } from '@angular/core';
import { SkyFileDropChange, SkyFileItem, SkyFileLink } from '@skyux/forms';

@Component({
  selector: 'app-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss'],
})
export class FileAttachmentComponent {
  @Input()
  public set addedFiles(value: boolean) {
    if (value) {
      const testUpload = <SkyFileDropChange>{
        files: [{
          file: {
            name: 'myTest.jpg',
            type: 'image/jpeg',
            size: 976,
          },
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCADDAK8DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAgJ/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuwEPs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q=='
        }],
        rejectedFiles: {}
      };
      this.filesUpdated(testUpload);
    }
  }

  public acceptedTypes = 'image/png,image/jpeg';

  public allItems: (SkyFileItem | SkyFileLink)[];

  public filesToUpload: SkyFileItem[];

  public linksToUpload: SkyFileLink[];

  public rejectedFiles: SkyFileItem[];

  constructor() {
    this.filesToUpload = [];
    this.rejectedFiles = [];
    this.allItems = [];
    this.linksToUpload = [];
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

  public validateFile(file: SkyFileItem): string | undefined {
    if (file.file.name.indexOf('a') === 0) {
      return 'You may not upload a file that begins with the letter "a."';
    }
    return;
  }

  #removeFromArray(
    items: (SkyFileItem | SkyFileLink)[],
    obj: SkyFileItem | SkyFileLink
  ): void {
    if (items) {
      const index = items.indexOf(obj);

      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
}
