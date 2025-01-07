import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyLiveAnnouncerService } from '@skyux/core';
import { SkyIdService } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { take } from 'rxjs/operators';

import { SkyFormErrorComponent } from '../../form-error/form-error.component';
import { SKY_FORM_ERRORS_ENABLED } from '../../form-error/form-errors-enabled-token';
import { SkyFormErrorsComponent } from '../../form-error/form-errors.component';
import { SkyInputBoxModule } from '../../input-box/input-box.module';
import { SkyFormsResourcesModule } from '../../shared/sky-forms-resources.module';
import { SkyFileAttachmentService } from '../file-attachment/file-attachment.service';
import { SkyFileItem } from '../shared/file-item';
import { SkyFileSizePipe } from '../shared/file-size.pipe';
import { SkyFileValidateFn } from '../shared/file-validate-function';

import { SkyFileDropChange } from './file-drop-change';
import { SkyFileLink } from './file-link';

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
  providers: [
    SkyFileAttachmentService,
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFileSizePipe,
    SkyFormErrorComponent,
    SkyFormErrorsComponent,
    SkyFormsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyThemeModule,
  ],
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
   * The ARIA label for the file upload button. This provides a text equivalent for
   * screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @default "Drag a file here or click to browse"
   */
  @Input()
  public fileUploadAriaLabel: string | undefined;

  /**
   * The ARIA label for the link upload input. This sets the button's `aria-label` attribute to provide a text equivalent for
   * screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @default "Link to a file"
   */
  @Input()
  public linkUploadAriaLabel: string | undefined;

  /**
   * The hint text for the link upload input.
   */
  @Input()
  public linkUploadHintText: string | undefined;

  /**
   * The minimum size in bytes for valid files.
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
   * The maximum size in bytes for valid files.
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
   * Whether users can drag and drop multiple files at the same time.
   */
  @Input()
  public multiple: boolean | undefined = true;

  /**
   * The custom validation function. This validation runs alongside the internal
   * file validation. This function takes a `SkyFileItem` object as a parameter.
   * The string returned is used as the error message in multi-file attachment.
   */
  @Input()
  public validateFn: SkyFileValidateFn | undefined;

  /**
   * The comma-delimited string literal of MIME types that users can attach.
   * By default, all file types are allowed.
   * @required
   */
  @Input()
  public acceptedTypes: string | undefined;

  /**
   * A custom error message to display when a file doesn't match the accepted types.
   * This replaces a default error message that lists all accepted types.
   */
  @Input()
  public acceptedTypesErrorMessage: string | undefined;

  /**
   * Whether to disable the option to browse for files to attach.
   */
  @Input()
  public noClick: boolean | undefined = false;

  /**
   * Whether to display the option to attach files from URLs rather than from local devices.
   */
  @Input()
  public allowLinks: boolean | undefined = false;

  /**
   * The text to display as the file attachment's label.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Whether to hide `labelText` from view.
   */
  @Input({ transform: booleanAttribute })
  public labelHidden = false;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public hintText: string | undefined;

  /**
   * Whether uploading a file or link is required.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input elements so that screen readers announce an invalid state until the input element
   * is complete.
   * For more information about the `aria-required` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-required).
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the file attachment label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * Whether the file attachment is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the file attachment.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-form-field-stacked')
  public stacked = false;

  /**
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the file attachment label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  @ViewChild('fileInput')
  public inputEl: ElementRef | undefined;

  public rejectedOver = false;
  public acceptedOver = false;
  public linkUrl: string | undefined;

  #enterEventTarget: any;

  #_maxFileSize = MAX_FILE_SIZE_DEFAULT;

  #_minFileSize = MIN_FILE_SIZE_DEFAULT;

  readonly #fileAttachmentService = inject(SkyFileAttachmentService);
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);
  readonly #idSvc = inject(SkyIdService);

  protected errorId = this.#idSvc.generateId();
  protected rejectedFiles: SkyFileItem[] = [];

  public ngOnDestroy(): void {
    this.filesChanged.complete();
    this.linkChanged.complete();
    this.linkInputBlur.complete();
  }

  public dropClicked(): void {
    if (!this.noClick && this.inputEl) {
      this.inputEl.nativeElement.click();
    }
  }

  public fileChangeEvent(fileChangeEvent: Event): void {
    this.#handleFiles(
      (fileChangeEvent.target as HTMLInputElement | undefined)?.files,
    );
  }

  public fileDragEnter(dragEnterEvent: DragEvent): void {
    // Save this target to know when the drag event leaves
    this.#enterEventTarget = dragEnterEvent.target;
    dragEnterEvent.stopPropagation();
    dragEnterEvent.preventDefault();
  }

  public fileDragOver(dragOverEvent: DragEvent): void {
    const transfer = dragOverEvent.dataTransfer;

    dragOverEvent.stopPropagation();
    dragOverEvent.preventDefault();

    if (transfer) {
      if (transfer.items) {
        const files = Array.from(transfer.items);

        for (const file of files) {
          if (
            file.type &&
            this.#fileAttachmentService.fileTypeRejected(
              file.type,
              this.acceptedTypes,
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
        dropEvent.dataTransfer.files,
      );
      const invalidNumberOfFiles =
        !this.multiple && dropEvent.dataTransfer.files.length > 1;

      if (hasDirectory || invalidNumberOfFiles) {
        return;
      }

      this.#handleFiles(dropEvent.dataTransfer.files);
    }
  }

  public fileDragLeave(dragLeaveEvent: any): void {
    if (this.#enterEventTarget === dragLeaveEvent.target) {
      this.rejectedOver = false;
      this.acceptedOver = false;
    }
  }

  public addLinkEnter(event: KeyboardEvent): void {
    if (event.which === 13) {
      this.addLink(event);
    }
  }

  public addLink(event: Event): void {
    event.preventDefault();
    this.linkChanged.emit({ url: this.linkUrl } as SkyFileLink);
    this.#announceState(
      'skyux_file_attachment_file_upload_link_added',
      this.linkUrl,
    );
    this.linkUrl = undefined;
  }

  public onLinkBlur(): void {
    this.linkInputBlur.emit();
  }

  #announceState(resourceString: string, ...args: any[]): void {
    this.#resourcesSvc
      .getString(resourceString, ...args)
      .pipe(take(1))
      .subscribe((internationalizedString) => {
        this.#liveAnnouncerSvc.announce(internationalizedString);
      });
  }

  #emitFileChangeEvent(
    totalFiles: number,
    rejectedFileArray: SkyFileItem[],
    validFileArray: SkyFileItem[],
  ): void {
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
    validFileArray: SkyFileItem[],
    rejectedFileArray: SkyFileItem[],
    totalFiles: number,
  ): void {
    rejectedFileArray.push(file);
    this.#emitFileChangeEvent(totalFiles, rejectedFileArray, validFileArray);
  }

  #loadFile(
    fileDrop: SkyFileDropComponent,
    file: SkyFileItem,
    validFileArray: SkyFileItem[],
    rejectedFileArray: SkyFileItem[],
    totalFiles: number,
  ): void {
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      file.url = event.target.result;
      validFileArray.push(file);
      fileDrop.#emitFileChangeEvent(
        totalFiles,
        rejectedFileArray,
        validFileArray,
      );
      this.#announceState(
        'skyux_file_attachment_file_upload_file_added',
        file.file.name,
      );
    });

    reader.addEventListener('error', () => {
      fileDrop.#filesRejected(
        file,
        validFileArray,
        rejectedFileArray,
        totalFiles,
      );
    });

    reader.addEventListener('abort', () => {
      fileDrop.#filesRejected(
        file,
        validFileArray,
        rejectedFileArray,
        totalFiles,
      );
    });

    reader.readAsDataURL(file.file);
  }

  #handleFiles(files?: FileList | null): void {
    if (files) {
      const validFileArray: SkyFileItem[] = [];
      const rejectedFileArray: SkyFileItem[] = [];
      const totalFiles = files.length;

      const processedFiles = this.#fileAttachmentService.checkFiles(
        files,
        this.minFileSize,
        this.maxFileSize,
        this.acceptedTypes,
        this.validateFn,
      );

      for (const file of processedFiles) {
        if (file.errorType) {
          this.#filesRejected(
            file,
            validFileArray,
            rejectedFileArray,
            totalFiles,
          );
        } else {
          this.#loadFile(
            this,
            file,
            validFileArray,
            rejectedFileArray,
            totalFiles,
          );
        }
      }

      this.rejectedFiles = rejectedFileArray;
    }
  }
}
