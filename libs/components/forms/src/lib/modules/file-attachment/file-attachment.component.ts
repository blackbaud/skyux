import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyFormsUtility } from '../shared/forms-utility';

import { SkyFileAttachmentLabelComponent } from './file-attachment-label.component';
import { SkyFileAttachmentService } from './file-attachment.service';
import { SkyFileItem } from './file-item';
import { SkyFileItemService } from './file-item.service';
import { SkyFileAttachmentChange } from './types/file-attachment-change';
import { SkyFileAttachmentClick } from './types/file-attachment-click';

let uniqueId = 0;

const MAX_FILE_SIZE_DEFAULT = 500000;
const MIN_FILE_SIZE_DEFAULT = 0;

/**
 * Provides an element to attach a single local file.
 */
@Component({
  selector: 'sky-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss'],
  providers: [SkyFileAttachmentService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFileAttachmentComponent
  implements AfterViewInit, AfterContentInit, OnInit, OnDestroy
{
  /**
   * Specifies a comma-delimited string literal of MIME types that users can attach.
   * By default, all file types are allowed.
   * @required
   */
  @Input()
  public acceptedTypes: string | undefined;

  /**
   * Indicates whether to disable the input.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    const newDisabledState = SkyFormsUtility.coerceBooleanProperty(value);
    if (this.#_disabled !== newDisabledState) {
      this.#_disabled = newDisabledState;
    }
  }

  public get disabled(): boolean {
    return this.#_disabled;
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
   * Specifies a custom validation function. This validation runs alongside the internal
   * file validation. This function takes a `SkyFileItem` object as a parameter.
   */
  @Input()
  // TODO: Change `Function` to a more specific type in a breaking change.
  public validateFn: Function | undefined;

  /**
   * Fires when users add or remove files.
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

  public fileDropDescriptionElementId: string;

  public labelElementId: string;

  public rejectedOver = false;

  /**
   * Indicates whether the input is required for form validation.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input element so that forms display an invalid state until the input element
   * is complete.
   */
  @Input()
  public required: boolean | undefined = false;

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

  @ViewChild('fileInput')
  public inputEl!: ElementRef;

  @ContentChildren(SkyFileAttachmentLabelComponent)
  public labelComponents:
    | QueryList<SkyFileAttachmentLabelComponent>
    | undefined;

  public isImage = false;

  #enterEventTarget: any;

  #fileAttachmentId = uniqueId++;

  #ngUnsubscribe = new Subject<void>();

  #_disabled = false;

  #_maxFileSize = MAX_FILE_SIZE_DEFAULT;

  #_minFileSize = MIN_FILE_SIZE_DEFAULT;

  #_value: SkyFileItem | undefined;

  #changeDetector: ChangeDetectorRef;
  #fileAttachmentService: SkyFileAttachmentService;
  #fileItemService: SkyFileItemService;
  #ngControl: NgControl | undefined;
  #themeSvc: SkyThemeService | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    fileAttachmentService: SkyFileAttachmentService,
    fileItemService: SkyFileItemService,
    @Self() @Optional() ngControl?: NgControl,
    @Optional() themeSvc?: SkyThemeService
  ) {
    this.#changeDetector = changeDetector;
    this.#fileAttachmentService = fileAttachmentService;
    this.#fileItemService = fileItemService;
    this.#ngControl = ngControl;
    this.#themeSvc = themeSvc;

    this.labelElementId = `sky-file-attachment-label-${this.#fileAttachmentId}`;
    this.fileDropDescriptionElementId = `sky-file-attachment-drop-description-${
      this.#fileAttachmentId
    }`;
    if (this.#ngControl) {
      this.#ngControl.valueAccessor = this;
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
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // Of note is the parent check which allows us to determine if the form is reactive.
    // Without this check there is a changed before checked error
    /* istanbul ignore else */
    if (this.#ngControl) {
      setTimeout(() => {
        this.#ngControl!.control!.setValue(this.value, {
          emitEvent: false,
        });
        this.#changeDetector.markForCheck();
      });

      // Backwards compatibility support for anyone still using Validators.Required.
      this.required =
        this.required || SkyFormsUtility.hasRequiredValidation(this.#ngControl);
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
          }
        );
    }
  }

  public onDropClicked(): void {
    this.#onTouched();
    this.inputEl.nativeElement.click();
  }

  public fileChangeEvent(fileChangeEvent: any): void {
    this.#handleFiles(fileChangeEvent.target.files);
  }

  public fileDragEnter(dragEnterEvent: any): void {
    // Save this target to know when the drag event leaves
    this.#enterEventTarget = dragEnterEvent.target;
    dragEnterEvent.stopPropagation();
    dragEnterEvent.preventDefault();
  }

  public fileDragOver(dragOverEvent: any): void {
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

  public fileDragLeave(dragLeaveEvent: any): void {
    if (this.#enterEventTarget === dragLeaveEvent.target) {
      this.rejectedOver = false;
      this.acceptedOver = false;
    }
  }

  public deleteFileAttachment(): void {
    this.value = undefined;
    this.#changeDetector.markForCheck();
    this.#emitFileChangeEvent(this.value);
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
  public setDisabledState(isDisabled: boolean) {
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

  #emitFileChangeEvent(currentFile: SkyFileItem | undefined): void {
    if (currentFile && !currentFile.errorType) {
      this.writeValue(currentFile);
    }
    this.fileChange.emit({
      file: currentFile,
    } as SkyFileAttachmentChange);

    this.inputEl.nativeElement.value = '';
  }

  #loadFile(file: SkyFileItem): void {
    if (file.file) {
      const reader = new FileReader();

      reader.addEventListener('load', (event: any): void => {
        file.url = event.target.result;
        this.#emitFileChangeEvent(file);
      });

      reader.addEventListener('error', (event: any): void => {
        this.#emitFileChangeEvent(file);
      });

      reader.addEventListener('abort', (event: any): void => {
        this.#emitFileChangeEvent(file);
      });

      reader.readAsDataURL(file.file);
    }
  }

  #handleFiles(files: FileList): void {
    const processedFiles = this.#fileAttachmentService.checkFiles(
      files,
      this.minFileSize,
      this.maxFileSize,
      this.acceptedTypes,
      this.validateFn
    );

    for (const file of processedFiles) {
      if (file.errorType) {
        this.#emitFileChangeEvent(file);
      } else {
        this.#loadFile(file);
      }
    }
  }

  #setFileName(file: SkyFileItem | undefined): void {
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onChange = (_: any) => {};
  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouched = () => {};
}
