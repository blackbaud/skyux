import { Component, Input } from '@angular/core';
import { SkyFileDropChange, SkyFileItem, SkyFileLink } from '@skyux/forms';

@Component({
  selector: 'app-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss'],
  standalone: false,
})
export class FileAttachmentComponent {
  @Input()
  public set addedFiles(value: boolean) {
    if (value) {
      const testUpload = {
        files: [
          {
            file: {
              name: 'myTest.jpg',
              type: 'image/jpeg',
              size: 976,
            },
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCADDAK8DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAgJ/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuwEPs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==',
          },
        ],
        rejectedFiles: {},
      } as SkyFileDropChange;
      this.filesUpdated(testUpload);
    }
  }

  public acceptedTypes = 'image/jpeg,txt';

  public allItems: (SkyFileItem | SkyFileLink)[];

  public filesToUpload: SkyFileItem[];

  public required = false;

  @Input()
  public basic = false;

  @Input()
  public set noPreview(value: boolean) {
    this.required = value;
    if (value) {
      const testUpload = {
        files: [
          {
            file: {
              name: 'myTest.jpg',
              type: 'image/jpg',
              size: 976,
            },
          },
          {
            file: {
              name: 'myPdf.pdf',
              size: 100,
            },
          },
          {
            file: {
              name: 'myFile.txt',
              size: 100,
            },
          },
          {
            file: {
              name: 'myUnknown.unk',
              size: 100,
            },
          },
          {
            file: {
              name: 'myDoc.doc',
              size: 100,
            },
          },
          {
            file: {
              name: 'myPowerpoint.ppt',
              size: 100,
            },
          },
        ],
        rejectedFiles: {},
      } as SkyFileDropChange;
      this.filesUpdated(testUpload);
    }
  }

  constructor() {
    this.filesToUpload = [];
    this.allItems = [];
  }

  public filesUpdated(result: SkyFileDropChange): void {
    this.filesToUpload = this.filesToUpload.concat(result.files);
    this.allItems = this.allItems.concat(result.files);
  }
}
