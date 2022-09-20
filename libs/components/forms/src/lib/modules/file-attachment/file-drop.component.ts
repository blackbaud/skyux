import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { SkyFileAttachmentService } from './file-attachment.service';
import { SkyFileItem } from './file-item';
import { SkyFileLink } from './file-link';
import { SkyFileDropChange } from './types/file-drop-change';

const MAX_FILE_SIZE_DEFAULT = 500000;
const MIN_FILE_SIZE_DEFAULT = 0;

/**
 * Provides an element to attach multiple files where users can browse or drag and drop local files
 * or provide hyperlinks to external files. You can leave the contents of the component
 * blank to display the drop zone's default UI, or you can specify custom content to
 * display instead. When the module initializes, it disables the ability to drag and
 * drop files for the entire window to prevent the browser from opening files that are
 * accidentally dropped outside the target zone. If you implement your own file drop functionality
 * outside of the file drop component, you can place the `sky-file-drop-target` CSS class
 * on the element that receives drop events to exempt it from the drop exclusion rule.
 */
@Component({
  selector: 'sky-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  providers: [SkyFileAttachmentService],
})
export class SkyFileDropComponent implements OnDestroy {
  /**
   * Fires when users add or remove files.
   */
  @Output()
  public filesChanged = new EventEmitter<SkyFileDropChange>();

  /**
   * Fires when the link input box triggers a blur event.
   */
  @Output()
  public linkInputBlur = new EventEmitter<void>();

  /**
   * Fires when users add or remove links.
   */
  @Output()
  public linkChanged = new EventEmitter<SkyFileLink>();

  /**
   * Specifies an ARIA label for the file upload button. This provides a text equivalent for
   * screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public fileUploadAriaLabel: string | undefined;

  /**
   * Specifies an ARIA label for the link upload input. This provides a text equivalent for
   * screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public linkUploadAriaLabel: string | undefined;

  /**
   * Specifies the minimum size in bytes for valid files.
   * @default 0
   */
  @Input()
  public set minFileSize(value: number | undefined) {
    this.#_minFileSize = value ?? MIN_FILE_SIZE_DEFAULT;
  }

  public get minFileSize(): number {
    return this.#_minFileSize;
  }

  /**
   * Specifies the maximum size in bytes for valid files.
   * @default 500000
   */
  @Input()
  public set maxFileSize(value: number | undefined) {
    this.#_maxFileSize = value ?? MAX_FILE_SIZE_DEFAULT;
  }

  public get maxFileSize(): number {
    return this.#_maxFileSize;
  }

  /**
   * Indicates whether users can drag and drop multiple files at the same time.
   */
  @Input()
  public multiple: boolean | undefined = true;

  /**
   * Specifies a custom validation function. This validation runs alongside the internal
   * file validation. This function takes a `SkyFileItem` object as a parameter.
   */
  @Input()
  // TODO: Change `Function` to a more specific type in a breaking change.
  public validateFn: Function | undefined;

  /**
   * Specifies a comma-delimited string literal of MIME types that users can attach.
   * By default, all file types are allowed.
   * @required
   */
  @Input()
  public acceptedTypes: string | undefined;

  /**
   * Indicates whether to disable the option to browse for files to attach.
   */
  @Input()
  public noClick: boolean | undefined = false;

  /**
   * Indicates whether to display the option to attach files from URLs rather than from local devices.
   */
  @Input()
  public allowLinks: boolean | undefined = false;

  @ViewChild('fileInput')
  public inputEl: ElementRef | undefined;

  public rejectedOver = false;
  public acceptedOver = false;
  public linkUrl: string | undefined;

  #enterEventTarget: any;

  #_maxFileSize = MAX_FILE_SIZE_DEFAULT;

  #_minFileSize = MIN_FILE_SIZE_DEFAULT;

  #fileAttachmentService: SkyFileAttachmentService;

  constructor(fileAttachmentService: SkyFileAttachmentService) {
    this.#fileAttachmentService = fileAttachmentService;
  }

  public ngOnDestroy() {
    this.filesChanged.complete();
    this.linkChanged.complete();
    this.linkInputBlur.complete();
  }

  public dropClicked() {
    if (!this.noClick && this.inputEl) {
      this.inputEl.nativeElement.click();
    }
  }

  public fileChangeEvent(fileChangeEvent: any) {
    this.#handleFiles(fileChangeEvent.target.files);
  }

  public fileDragEnter(dragEnterEvent: any) {
    // Save this target to know when the drag event leaves
    this.#enterEventTarget = dragEnterEvent.target;
    dragEnterEvent.stopPropagation();
    dragEnterEvent.preventDefault();
  }

  public fileDragOver(dragOverEvent: any) {
    const transfer = dragOverEvent.dataTransfer;

    dragOverEvent.stopPropagation();
    dragOverEvent.preventDefault();

    if (transfer) {
      if (transfer.items) {
        const files = transfer.items;

        for (let index = 0; index < files.length; index++) {
          const file: any = files[index];

          if (
            file.type &&
            this.#fileAttachmentService.fileTypeRejected(
              file.type,
              this.acceptedTypes
            )
          ) {
            this.rejectedOver = true;
            this.acceptedOver = false;
            return;
          }
        }

        if (files.length > 0 && !this.acceptedOver) {
          this.rejectedOver = false;
          this.acceptedOver = true;
        }
      } /* istanbul ignore next: untestable */ else if (transfer.files) {
        // If the browser does not support DataTransfer.items,
        // defer file-type checking to drop handler.
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items#Browser_compatibility
        this.rejectedOver = false;
        this.acceptedOver = true;
      }
    }
  }

  public fileDrop(dropEvent: DragEvent): void {
    dropEvent.stopPropagation();
    dropEvent.preventDefault();

    this.#enterEventTarget = undefined;
    this.rejectedOver = false;
    this.acceptedOver = false;

    if (dropEvent.dataTransfer && dropEvent.dataTransfer.files) {
      const hasDirectory = this.#fileAttachmentService.hasDirectory(
        dropEvent.dataTransfer.files
      );
      const invalidNumberOfFiles =
        !this.multiple && dropEvent.dataTransfer.files.length > 1;

      if (hasDirectory || invalidNumberOfFiles) {
        return;
      }

      this.#handleFiles(dropEvent.dataTransfer.files);
    }
  }

  public fileDragLeave(dragLeaveEvent: any) {
    if (this.#enterEventTarget === dragLeaveEvent.target) {
      this.rejectedOver = false;
      this.acceptedOver = false;
    }
  }

  public addLinkEnter(event: KeyboardEvent) {
    if (event.which === 13) {
      this.addLink(event);
    }
  }

  public addLink(event: Event) {
    event.preventDefault();
    this.linkChanged.emit({ url: this.linkUrl } as SkyFileLink);
    this.linkUrl = undefined;
  }

  public onLinkBlur(): void {
    this.linkInputBlur.emit();
  }

  #emitFileChangeEvent(
    totalFiles: number,
    rejectedFileArray: Array<SkyFileItem>,
    validFileArray: Array<SkyFileItem>
  ) {
    if (totalFiles === rejectedFileArray.length + validFileArray.length) {
      this.filesChanged.emit({
        files: validFileArray,
        rejectedFiles: rejectedFileArray,
      } as SkyFileDropChange);

      if (this.inputEl) {
        this.inputEl.nativeElement.value = '';
      }
    }
  }

  #filesRejected(
    file: SkyFileItem,
    validFileArray: Array<SkyFileItem>,
    rejectedFileArray: Array<SkyFileItem>,
    totalFiles: number
  ) {
    rejectedFileArray.push(file);
    this.#emitFileChangeEvent(totalFiles, rejectedFileArray, validFileArray);
  }

  #loadFile(
    fileDrop: SkyFileDropComponent,
    file: SkyFileItem,
    validFileArray: Array<SkyFileItem>,
    rejectedFileArray: Array<SkyFileItem>,
    totalFiles: number
  ) {
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      file.url = event.target.result;
      validFileArray.push(file);
      fileDrop.#emitFileChangeEvent(
        totalFiles,
        rejectedFileArray,
        validFileArray
      );
    });

    reader.addEventListener('error', (event: any) => {
      fileDrop.#filesRejected(
        file,
        validFileArray,
        rejectedFileArray,
        totalFiles
      );
    });

    reader.addEventListener('abort', (event: any) => {
      fileDrop.#filesRejected(
        file,
        validFileArray,
        rejectedFileArray,
        totalFiles
      );
    });

    reader.readAsDataURL(file.file);
  }

  #handleFiles(files: FileList) {
    const validFileArray: Array<SkyFileItem> = [];
    const rejectedFileArray: Array<SkyFileItem> = [];
    const totalFiles = files.length;

    const processedFiles = this.#fileAttachmentService.checkFiles(
      files,
      this.minFileSize,
      this.maxFileSize,
      this.acceptedTypes,
      this.validateFn
    );

    for (const file of processedFiles) {
      if (file.errorType) {
        this.#filesRejected(
          file,
          validFileArray,
          rejectedFileArray,
          totalFiles
        );
      } else {
        this.#loadFile(
          this,
          file,
          validFileArray,
          rejectedFileArray,
          totalFiles
        );
      }
    }
  }
}
