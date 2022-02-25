import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { SkyFileItem } from './file-item';

import { SkyFileLink } from './file-link';

import { SkyFileDropChange } from './types/file-drop-change';

import { SkyFileAttachmentService } from './file-attachment.service';

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
  public fileUploadAriaLabel: string;

  /**
   * Specifies an ARIA label for the link upload input. This provides a text equivalent for
   * screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public linkUploadAriaLabel: string;

  /**
   * Specifies the minimum size in bytes for valid files.
   */
  @Input()
  public minFileSize: number = 0;

  /**
   * Specifies the maximum size in bytes for valid files.
   */
  @Input()
  public maxFileSize: number = 500000;

  /**
   * Indicates whether users can drag and drop multiple files at the same time.
   */
  @Input()
  public multiple: boolean = true;

  /**
   * Specifies a custom validation function. This validation runs alongside the internal
   * file validation. This function takes a `SkyFileItem` object as a parameter.
   */
  @Input()
  public validateFn: Function;

  /**
   * Specifies a comma-delimited string literal of MIME types that users can attach.
   * By default, all file types are allowed.
   * @required
   */
  @Input()
  public acceptedTypes: string;

  /**
   * Indicates whether to disable the option to browse for files to attach.
   */
  @Input()
  public noClick: boolean = false;

  /**
   * Indicates whether to display the option to attach files from URLs rather than from local devices.
   */
  @Input()
  public allowLinks: boolean = false;

  @ViewChild('fileInput')
  public inputEl: ElementRef;

  public rejectedOver: boolean = false;
  public acceptedOver: boolean = false;
  public linkUrl: string;

  private enterEventTarget: any;

  constructor(private fileAttachmentService: SkyFileAttachmentService) {}

  public ngOnDestroy() {
    this.filesChanged.complete();
    this.linkChanged.complete();
    this.linkInputBlur.complete();
  }

  public dropClicked() {
    if (!this.noClick) {
      this.inputEl.nativeElement.click();
    }
  }

  public fileChangeEvent(fileChangeEvent: any) {
    this.handleFiles(fileChangeEvent.target.files);
  }

  public fileDragEnter(dragEnterEvent: any) {
    // Save this target to know when the drag event leaves
    this.enterEventTarget = dragEnterEvent.target;
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
            this.fileAttachmentService.fileTypeRejected(
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

    this.enterEventTarget = undefined;
    this.rejectedOver = false;
    this.acceptedOver = false;

    if (dropEvent.dataTransfer && dropEvent.dataTransfer.files) {
      const hasDirectory = this.fileAttachmentService.hasDirectory(
        dropEvent.dataTransfer.files
      );
      const invalidNumberOfFiles =
        !this.multiple && dropEvent.dataTransfer.files.length > 1;

      if (hasDirectory || invalidNumberOfFiles) {
        return;
      }

      this.handleFiles(dropEvent.dataTransfer.files);
    }
  }

  public fileDragLeave(dragLeaveEvent: any) {
    if (this.enterEventTarget === dragLeaveEvent.target) {
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

  private emitFileChangeEvent(
    totalFiles: number,
    rejectedFileArray: Array<SkyFileItem>,
    validFileArray: Array<SkyFileItem>
  ) {
    if (totalFiles === rejectedFileArray.length + validFileArray.length) {
      this.filesChanged.emit({
        files: validFileArray,
        rejectedFiles: rejectedFileArray,
      } as SkyFileDropChange);

      this.inputEl.nativeElement.value = '';
    }
  }

  private filesRejected(
    file: SkyFileItem,
    validFileArray: Array<SkyFileItem>,
    rejectedFileArray: Array<SkyFileItem>,
    totalFiles: number
  ) {
    rejectedFileArray.push(file);
    this.emitFileChangeEvent(totalFiles, rejectedFileArray, validFileArray);
  }

  private loadFile(
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
      fileDrop.emitFileChangeEvent(
        totalFiles,
        rejectedFileArray,
        validFileArray
      );
    });

    reader.addEventListener('error', (event: any) => {
      fileDrop.filesRejected(
        file,
        validFileArray,
        rejectedFileArray,
        totalFiles
      );
    });

    reader.addEventListener('abort', (event: any) => {
      fileDrop.filesRejected(
        file,
        validFileArray,
        rejectedFileArray,
        totalFiles
      );
    });

    reader.readAsDataURL(file.file);
  }

  private handleFiles(files: FileList) {
    let validFileArray: Array<SkyFileItem> = [];
    let rejectedFileArray: Array<SkyFileItem> = [];
    let totalFiles = files.length;
    let fileDrop = this;

    // tslint:disable-next-line: max-line-length
    let processedFiles = this.fileAttachmentService.checkFiles(
      files,
      this.minFileSize,
      this.maxFileSize,
      this.acceptedTypes,
      this.validateFn
    );

    for (let file of processedFiles) {
      if (file.errorType) {
        this.filesRejected(file, validFileArray, rejectedFileArray, totalFiles);
      } else {
        this.loadFile(
          fileDrop,
          file,
          validFileArray,
          rejectedFileArray,
          totalFiles
        );
      }
    }
  }
}
