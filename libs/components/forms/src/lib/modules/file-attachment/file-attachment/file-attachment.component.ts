import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  SkyFileReaderService,
  SkyIdModule,
  SkyIdService,
  SkyLiveAnnouncerService,
} from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyThemeComponentClassDirective,
  SkyThemeModule,
  SkyThemeService,
} from '@skyux/theme';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyFormErrorComponent } from '../../form-error/form-error.component';
import { SKY_FORM_ERRORS_ENABLED } from '../../form-error/form-errors-enabled-token';
import { SkyFormErrorsComponent } from '../../form-error/form-errors.component';
import { SkyFormsResourcesModule } from '../../shared/sky-forms-resources.module';
import { SkyFileItem } from '../shared/file-item';
import { SkyFileItemErrorType } from '../shared/file-item-error-type';
import { SkyFileItemService } from '../shared/file-item.service';
import { SkyFileSizePipe } from '../shared/file-size.pipe';
import { SkyFileValidateFn } from '../shared/file-validate-function';

import { SkyFileAttachmentChange } from './file-attachment-change';
import { SkyFileAttachmentClick } from './file-attachment-click';
import { SkyFileAttachmentJoinIdsPipe } from './file-attachment-join-ids.pipe';
import { SkyFileAttachmentLabelComponent } from './file-attachment-label.component';
import { SkyFileAttachmentService } from './file-attachment.service';

const MAX_FILE_SIZE_DEFAULT = 500000;
const MIN_FILE_SIZE_DEFAULT = 0;

/**
 * Provides an element to attach a single local file.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyFileAttachmentJoinIdsPipe,
    SkyFileSizePipe,
    SkyFormErrorComponent,
    SkyFormErrorsComponent,
    SkyFormsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyThemeModule,
    SkyThemeComponentClassDirective,
  ],
  providers: [
    SkyFileAttachmentService,
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
  hostDirectives: [SkyThemeComponentClassDirective],
  selector: 'sky-file-attachment',
  styleUrl: './file-attachment.component.scss',
  templateUrl: './file-attachment.component.html',
})
export class SkyFileAttachmentComponent
  implements
    AfterViewInit,
    AfterContentInit,
    ControlValueAccessor,
    OnInit,
    OnDestroy
{
  readonly #fileReaderSvc = inject(SkyFileReaderService);

  /**
   * The comma-delimited string literal of MIME types that users can attach.
   * By default, all file types are allowed.
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
   * Whether to disable the input on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   */
  @Input({ transform: booleanAttribute })
  public disabled = false;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the single file attachment label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
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
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the single file attachment label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

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
   * Whether the single file attachment is stacked on another form component. When specified,
   * the appropriate vertical spacing is automatically added to the single file attachment.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-form-field-stacked')
  public stacked = false;

  /**
   * The custom validation function. This validation runs alongside the internal
   * file validation. This function takes a `SkyFileItem` object as a parameter.
   * @deprecated Add a custom Angular `Validator` function to the `FormControl` instead.
   */
  @Input()
  public validateFn: SkyFileValidateFn | undefined;

  /**
   * Fires when users add or remove files.
   * @deprecated Subscribe to the form control's `valueChanges` event instead.
   */
  @Output()
  public fileChange = new EventEmitter<SkyFileAttachmentChange>();

  /**
   * Fires when users select the file name link. Make sure to bind the event.
   * If you do not, the file name link will be a dead link.
   */
  @Output()
  public fileClick = new EventEmitter<SkyFileAttachmentClick>();

  public acceptedOver = false;

  public hasLabelComponent = false;

  public rejectedOver = false;

  /**
   * Whether the input is required for form validation.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input element so that forms display an invalid state until the input element
   * is complete.
   * For more information about the `aria-required` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-required).
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  public set value(value: SkyFileItem | undefined | null) {
    // The null check is needed to address a bug in Angular 4.
    // writeValue is being called twice, first time with a phantom null value
    // See: https://github.com/angular/angular/issues/14988
    const isNewValue = value !== this.value && value !== null;

    if (isNewValue) {
      if (value) {
        this.isImage = this.#fileItemService.isImage(value);
      } else {
        this.isImage = false;
      }
      this.#setFileName(value);

      this.#_value = value;
      this.#onChange(value);
      this.#updateFileAttachmentButton();
    }
  }

  public get value(): SkyFileItem | undefined {
    return this.#_value;
  }

  public currentThemeName: string | undefined;

  public fileName = '';

  public showFileAttachmentButton = true;

  public truncatedFileName = '';

  @ViewChild('fileInputRef')
  public inputEl: ElementRef | undefined;

  @ContentChildren(SkyFileAttachmentLabelComponent)
  public labelComponents:
    | QueryList<SkyFileAttachmentLabelComponent>
    | undefined;

  public isImage = false;

  protected get isRequired(): boolean {
    return (
      this.required ||
      (this.ngControl?.control?.hasValidator(Validators.required) ?? false)
    );
  }

  #enterEventTarget: EventTarget | undefined | null;

  #ngUnsubscribe = new Subject<void>();

  #_maxFileSize = MAX_FILE_SIZE_DEFAULT;

  #_minFileSize = MIN_FILE_SIZE_DEFAULT;

  #_value: SkyFileItem | undefined;

  #changeDetector: ChangeDetectorRef;
  #fileAttachmentService: SkyFileAttachmentService;
  #fileItemService: SkyFileItemService;
  #themeSvc: SkyThemeService | undefined;

  readonly #idSvc = inject(SkyIdService);
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  protected ngControl: NgControl | undefined;
  protected errorId = this.#idSvc.generateId();
  protected labelId = this.#idSvc.generateId();

  protected fileErrorName: SkyFileItemErrorType | undefined;
  protected fileErrorParam: string | undefined;
  protected fileErrorValidation: ValidationErrors | null | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    fileAttachmentService: SkyFileAttachmentService,
    fileItemService: SkyFileItemService,
    @Self() @Optional() ngControl?: NgControl,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#changeDetector = changeDetector;
    this.#fileAttachmentService = fileAttachmentService;
    this.#fileItemService = fileItemService;
    this.ngControl = ngControl;
    this.#themeSvc = themeSvc;

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.currentThemeName = themeSettings.currentSettings.theme.name;
          this.#updateFileAttachmentButton();
        });
    }
  }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 7.
    // When a control value is set initially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // Of note is the parent check which allows us to determine if the form is reactive.
    // Without this check there is a changed before checked error
    /* istanbul ignore else */
    if (this.ngControl) {
      setTimeout(() => {
        this.ngControl?.control?.setValue(this.value, {
          emitEvent: false,
        });
        this.#changeDetector.markForCheck();
      });

      // There is some disconnect between the host control and the form control.
      // This handles that by running change detection whenever the host control
      // has any changes. This is a workaround for this existing bug and will be
      // addressed in a future story that refactors file attachment.
      this.ngControl.control?.events.subscribe(() => {
        this.#changeDetector.markForCheck();
      });
    }
  }

  public ngAfterContentInit(): void {
    if (this.labelComponents) {
      this.hasLabelComponent = this.labelComponents.length > 0;
      this.#changeDetector.detectChanges();

      // Handles updating classes when label changes
      this.labelComponents.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(
          (newLabelComponents: QueryList<SkyFileAttachmentLabelComponent>) => {
            this.hasLabelComponent = newLabelComponents.length > 0;
            this.#changeDetector.markForCheck();
          },
        );
    }
  }

  public onFileCancel(): void {
    this.#onTouched();
  }

  public onDropClicked(): void {
    // this.#onTouched();
    /* istanbul ignore else */
    if (this.inputEl) {
      this.inputEl.nativeElement.click();
    }
  }

  public fileChangeEvent(fileChangeEvent: Event): void {
    /** Set a timeout here to allow the browser to regain context from the system dialog. Without this, error messages do not read out correctly to screen readers. */
    setTimeout(() => {
      this.#handleFiles(
        (fileChangeEvent.target as HTMLInputElement | undefined)?.files,
      );
    }, 500);
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
      } else if (transfer.files) {
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
      if (dropEvent.dataTransfer.files.length > 1) {
        return;
      }

      if (
        this.#fileAttachmentService.hasDirectory(dropEvent.dataTransfer.files)
      ) {
        return;
      }

      this.#handleFiles(dropEvent.dataTransfer.files);
    }
  }

  public fileDragLeave(dragLeaveEvent: DragEvent): void {
    if (this.#enterEventTarget === dragLeaveEvent.target) {
      this.rejectedOver = false;
      this.acceptedOver = false;
    }
  }

  public deleteFileAttachment(): void {
    const fileName = this.value?.file.name;
    this.value = undefined;
    this.#emitFileChangeEvent(this.value);

    /* istanbul ignore else: safety check */
    if (fileName) {
      this.#announceState(
        'skyux_file_attachment_file_upload_file_removed',
        fileName,
      );
    }

    this.#changeDetector.markForCheck();
  }

  public ngOnDestroy(): void {
    this.fileChange.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public registerOnChange(fn: (value: any) => any): void {
    this.#onChange = fn;
  }
  public registerOnTouched(fn: () => any): void {
    this.#onTouched = fn;
  }

  public writeValue(value: any): void {
    this.value = value;
    this.#changeDetector.markForCheck();
  }

  /**
   * @internal
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.#changeDetector.markForCheck();
  }

  public emitClick(): void {
    /* istanbul ignore else */
    if (this.value) {
      this.fileClick.emit({
        file: this.value,
      });
    }
  }

  #announceState(resourceString: string, ...args: any[]): void {
    this.#resourcesSvc
      .getString(resourceString, ...args)
      .pipe(take(1))
      .subscribe((internationalizedString) => {
        this.#liveAnnouncerSvc.announce(internationalizedString);
      });
  }

  #emitFileChangeEvent(currentFile?: SkyFileItem): void {
    if (currentFile && !currentFile.errorType) {
      this.writeValue(currentFile);
      this.fileErrorName = undefined;
      this.fileErrorParam = undefined;
      this.fileErrorValidation = undefined;
    } else {
      this.writeValue(undefined);
      // Makes sure value accessor is marked as dirty even if current file is undefined
      this.#onChange(undefined);
      this.fileErrorValidation = { fileError: true };
      this.fileErrorName = currentFile?.errorType;
      this.fileErrorParam = currentFile?.errorParam;
    }
    this.fileChange.emit({
      file: currentFile,
    } as SkyFileAttachmentChange);

    /* istanbul ignore else */
    if (this.inputEl) {
      this.inputEl.nativeElement.value = '';
    }
  }

  async #loadFile(file: SkyFileItem): Promise<void> {
    if (file.file) {
      try {
        const previousFileName = this.value?.file.name;

        if (previousFileName) {
          this.#announceState(
            'skyux_file_attachment_file_upload_file_replaced',
            previousFileName,
            file.file.name,
          );
        } else {
          this.#announceState(
            'skyux_file_attachment_file_upload_file_added',
            file.file.name,
          );
        }

        file.url = await this.#fileReaderSvc.readAsDataURL(file.file);

        this.#emitFileChangeEvent(file);
      } catch {
        this.#emitFileChangeEvent(file);
      }
    }
  }

  #handleFiles(fileList?: FileList | null): void {
    this.#onTouched();

    if (fileList) {
      const files: SkyFileItem[] = [];

      if ('item' in fileList) {
        for (let index = 0; index < fileList.length; index++) {
          files.push({
            file: fileList.item(index),
          } as SkyFileItem);
        }
      }

      const processedFiles = this.#fileAttachmentService.checkFiles(
        files,
        this.minFileSize,
        this.maxFileSize,
        this.acceptedTypes,
        this.validateFn,
      );

      for (const file of processedFiles) {
        if (file.errorType) {
          this.#emitFileChangeEvent(file);
        } else {
          void this.#loadFile(file);
        }
      }
    }
  }

  #setFileName(file?: SkyFileItem): void {
    if (file) {
      const dropName =
        this.#fileItemService.isFile(file) && file.file.name
          ? file.file.name
          : file.url;

      this.fileName = dropName;

      if (dropName.length > 26) {
        this.truncatedFileName = dropName.slice(0, 26) + '...';
      } else {
        this.truncatedFileName = dropName;
      }
    } else {
      this.fileName = '';
      this.truncatedFileName = '';
    }
  }

  #updateFileAttachmentButton(): void {
    this.showFileAttachmentButton = !(
      this.value && this.currentThemeName === 'modern'
    );
    this.#changeDetector.markForCheck();
  }

  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  #onChange = (_: any): void => {
    return;
  };
  // istanbul ignore next
  #onTouched = (): void => {
    return;
  };
}
