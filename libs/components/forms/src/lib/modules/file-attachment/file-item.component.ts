import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
} from '@angular/core';

import { SkyFileItem } from './file-item';
import { SkyFileItemService } from './file-item.service';
import { SkyFileLink } from './file-link';

@Component({
  selector: 'sky-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class SkyFileItemComponent implements DoCheck {
  /**
   * Specifies the summary information to display about file attachments. For local files,
   * the default summary includes the file name, file size, file preview, and a delete button.
   * For external files, the default summary includes the URL and a delete button.
   * You can include additional inputs to display user-entered metadata.
   * @required
   */
  @Input()
  public fileItem: SkyFileItem | SkyFileLink;

  /**
   * Fires when users select the delete button for an item. The deleted item is passed to the
   * function.
   */
  @Output()
  public deleteFile = new EventEmitter<SkyFileLink | SkyFileItem>();

  public get fileName(): string {
    return (this.fileItem as SkyFileItem).file.name;
  }

  public get fileSize(): number {
    return (this.fileItem as SkyFileItem).file.size;
  }

  public get url(): string {
    return this.fileItem.url;
  }

  public icon: string;

  private differ: KeyValueDiffer<any, any>;

  public constructor(
    private differs: KeyValueDiffers,
    private fileItemService: SkyFileItemService
  ) {
    this.differ = this.differs.find({}).create();
  }

  public ngDoCheck() {
    let changes = this.differ.diff(this.fileItem);

    if (changes) {
      let cls: string,
        extensionUpper = this.fileItemService.getFileExtensionUpper(
          this.fileItem as SkyFileItem
        ),
        fileTypeUpper: string;

      switch (extensionUpper) {
        case '.PDF':
          cls = 'pdf';
          break;
        case '.GZ':
        case '.RAR':
        case '.TGZ':
        case '.ZIP':
          cls = 'archive';
          break;
        case '.PPT':
        case '.PPTX':
          cls = 'powerpoint';
          break;
        case '.DOC':
        case '.DOCX':
          cls = 'word';
          break;
        case '.XLS':
        case '.XLSX':
          cls = 'excel';
          break;
        case '.TXT':
          cls = 'text';
          break;
        case '.HTM':
        case '.HTML':
          cls = 'code';
          break;
        default:
          break;
      }

      if (!cls) {
        fileTypeUpper = this.fileItemService.getFileTypeUpper(
          this.fileItem as SkyFileItem
        );

        switch (fileTypeUpper.substr(0, fileTypeUpper.indexOf('/'))) {
          case 'AUDIO':
            cls = 'audio';
            break;
          case 'IMAGE':
            // Normally images are displayed as thumbnails, but if an image type is not recognized
            // as being widely supported by modern browsers (e.g. TIFF files) then an icon should
            // be displayed instead.
            cls = 'image';
            break;
          case 'TEXT':
            cls = 'text';
            break;
          case 'VIDEO':
            cls = 'video';
            break;
          default:
            break;
        }
      }
      this.icon = 'file-' + (cls ? cls + '-' : '') + 'o';
    }
  }

  public itemDelete() {
    this.deleteFile.emit(this.fileItem);
  }

  public isFile() {
    return this.fileItemService.isFile(this.fileItem as SkyFileItem);
  }

  public isImage() {
    return this.fileItemService.isImage(this.fileItem as SkyFileItem);
  }
}
