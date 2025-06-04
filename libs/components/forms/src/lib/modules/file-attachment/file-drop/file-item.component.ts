import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
  inject,
} from '@angular/core';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';

import { take } from 'rxjs/operators';

import { SkyFormsResourcesModule } from '../../shared/sky-forms-resources.module';
import { SkyFileItem } from '../shared/file-item';
import { SkyFileItemService } from '../shared/file-item.service';
import { SkyFileSizePipe } from '../shared/file-size.pipe';

import { SkyFileLink } from './file-link';

@Component({
  imports: [SkyFileSizePipe, SkyFormsResourcesModule, SkyIconModule],
  selector: 'sky-file-item',
  styleUrl: './file-item.component.scss',
  templateUrl: './file-item.component.html',
})
export class SkyFileItemComponent implements DoCheck {
  /**
   * The summary information to display about file attachments. For local files,
   * the default summary includes the file name, file size, file preview, and a delete button.
   * For external files, the default summary includes the URL and a delete button.
   * You can include additional inputs to display user-entered metadata.
   * @required
   */
  @Input()
  public set fileItem(value: SkyFileItem | SkyFileLink | undefined) {
    this.#_fileItem = value;
    if (value && 'file' in value) {
      this.isFile = this.#fileItemService.isFile(value);
      this.isImage = this.#fileItemService.isImage(value);
      this.fileName = value.file.name;
      this.fileSize = value.file.size;
    } else {
      this.isFile = this.isImage = false;
      this.fileName = '';
      this.fileSize = undefined;
    }
    this.url = value?.url ?? '';
  }

  public get fileItem(): SkyFileItem | SkyFileLink | undefined {
    return this.#_fileItem;
  }

  /**
   * Fires when users select the delete button for an item. The deleted item is passed to the
   * function.
   */
  @Output()
  public deleteFile = new EventEmitter<SkyFileLink | SkyFileItem>();

  public fileName = '';

  public fileSize: number | undefined;

  public url = '';

  public icon: string | undefined;

  public isFile = false;
  public isImage = false;

  #_fileItem: SkyFileItem | SkyFileLink | undefined;

  #differ: KeyValueDiffer<any, any>;
  #fileItemService: SkyFileItemService;

  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);

  readonly #resourcesSvc = inject(SkyLibResourcesService);

  constructor(differs: KeyValueDiffers, fileItemService: SkyFileItemService) {
    this.#differ = differs.find({}).create();
    this.#fileItemService = fileItemService;
  }

  public ngDoCheck(): void {
    if (this.fileItem) {
      const changes = this.#differ.diff(this.fileItem);

      if (changes) {
        let cls: string | undefined;
        const extensionUpper = this.#fileItemService.getFileExtensionUpper(
          this.fileItem as SkyFileItem,
        );
        let fileTypeUpper: string;

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
            cls = 'ppt';
            break;
          case '.DOC':
          case '.DOCX':
            cls = 'doc';
            break;
          case '.XLS':
          case '.XLSX':
            cls = 'xls';
            break;
          case '.TXT':
            cls = 'text';
            break;
          case '.HTM':
          case '.HTML':
            cls = 'chevron-double';
            break;
          default:
            break;
        }

        if (!cls) {
          fileTypeUpper = this.#fileItemService.getFileTypeUpper(
            this.fileItem as SkyFileItem,
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
        this.icon = 'document' + (cls ? '-' + cls : '');
      }
    } else {
      this.icon = undefined;
    }
  }

  public itemDelete(): void {
    this.deleteFile.emit(this.fileItem);
    if (!this.isFile) {
      this.#resourcesSvc
        .getString('skyux_file_attachment_file_upload_link_removed', this.url)
        .pipe(take(1))
        .subscribe((resourceString) => {
          this.#liveAnnouncerSvc.announce(resourceString);
        });
    } else {
      this.#resourcesSvc
        .getString(
          'skyux_file_attachment_file_upload_file_removed',
          this.fileName,
        )
        .pipe(take(1))
        .subscribe((resourceString) => {
          this.#liveAnnouncerSvc.announce(resourceString);
        });
    }
  }
}
