import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  QueryList
} from '@angular/core';

import {
  ControlValueAccessor,
  AbstractControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';

import {
  Subject
} from 'rxjs';

import {
  SkyFileAttachmentChange
} from './types/file-attachment-change';

import {
  SkyFileAttachmentClick
} from './types/file-attachment-click';

import {
  SkyFileAttachmentLabelComponent
} from './file-attachment-label.component';

import {
  SkyFileAttachmentService
} from './file-attachment.service';

import {
  SkyFileItem
} from './file-item';

import {
  SkyFileItemService
} from './file-item.service';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_FILE_ATTACHMENT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyFileAttachmentComponent),
  multi: true
};

const SKY_FILE_ATTACHMENT_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyFileAttachmentComponent),
  multi: true
};

let uniqueId = 0;
@Component({
  selector: 'sky-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss'],
  providers: [
    SKY_FILE_ATTACHMENT_VALUE_ACCESSOR,
    SKY_FILE_ATTACHMENT_VALIDATOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFileAttachmentComponent implements ControlValueAccessor, AfterViewInit, AfterContentInit, OnDestroy {
  @Input()
  public acceptedTypes: string;

  @Input()
  public maxFileSize: number = 500000;

  @Input()
  public minFileSize: number = 0;

  @Input()
  public validateFn: Function;

  @Output()
  public fileChange = new EventEmitter<SkyFileAttachmentChange>();

  @Output()
  public fileClick = new EventEmitter<SkyFileAttachmentClick>();

  public acceptedOver: boolean = false;

  public get hasLabelComponent(): boolean {
    return this.labelComponents.length > 0;
  }

  public get labelElementId(): string {
    return `sky-file-attachment-label-${this.fileAttachmentId}`;
  }

  public rejectedOver: boolean = false;

  public required: boolean = false;

  public set value(value: SkyFileItem) {
    // The null check is needed to address a bug in Angular 4.
    // writeValue is being called twice, first time with a phantom null value
    // See: https://github.com/angular/angular/issues/14988
    // tslint:disable-next-line:no-null-keyword
    const isNewValue = value !== this.value && value !== null;

    if (isNewValue) {
      this._value = value;
      this._onChange(value);
    }
  }

  public get value(): SkyFileItem {
    return this._value;
  }

  @ViewChild('fileInput')
  private inputEl: ElementRef;

  @ContentChildren(SkyFileAttachmentLabelComponent)
  private labelComponents: QueryList<SkyFileAttachmentLabelComponent>;

  private control: AbstractControl;
  private enterEventTarget: any;
  private fileAttachmentId = uniqueId++;
  private ngUnsubscribe = new Subject<void>();
  private _value: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private fileAttachmentService: SkyFileAttachmentService,
    private fileItemService: SkyFileItemService
  ) { }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 7.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // Of note is the parent check which allows us to determine if the form is reactive.
    // Without this check there is a changed before checked error
    /* istanbul ignore else */
    if (this.control) {
      setTimeout(() => {
        this.control.setValue(this.value, {
          emitEvent: false
        });

        // Set required to apply required state to label
        if (this.control.errors && this.control.errors.required) {
          this.required = true;
        }

        this.changeDetector.markForCheck();
      });
    }
  }

  public ngAfterContentInit(): void {
    // Handles updating classes when label changes
    this.labelComponents.changes
    .takeUntil(this.ngUnsubscribe)
    .subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  public isImage(): boolean {
    return this.fileItemService.isImage(this.value);
  }

  public onDropClicked(): void {
    this._onTouched();
    this.inputEl.nativeElement.click();
  }

  public fileChangeEvent(fileChangeEvent: any): void {
    this.handleFiles(fileChangeEvent.target.files);
  }

  public fileDragEnter(dragEnterEvent: any): void {
    // Save this target to know when the drag event leaves
    this.enterEventTarget = dragEnterEvent.target;
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

          if (file.type && this.fileAttachmentService.fileTypeRejected(file.type, this.acceptedTypes)) {
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

  public fileDrop(dropEvent: any): void {
    dropEvent.stopPropagation();
    dropEvent.preventDefault();

    this.enterEventTarget = undefined;
    this.rejectedOver = false;
    this.acceptedOver = false;

    if (dropEvent.dataTransfer && dropEvent.dataTransfer.files) {
      if (this.fileAttachmentService.verifyDropFiles(dropEvent.dataTransfer.files)) {
        this.handleFiles(dropEvent.dataTransfer.files);
      }
    }
  }

  public fileDragLeave(dragLeaveEvent: any): void {
    if (this.enterEventTarget === dragLeaveEvent.target) {
      this.rejectedOver = false;
      this.acceptedOver = false;
    }
  }

  public deleteFileAttachment(): void {
    this.value = undefined;
    this.changeDetector.markForCheck();
    this.emitFileChangeEvent(this.value);
  }

  public getFileName(): string | undefined {
    if (this.value) {
      // tslint:disable-next-line: max-line-length
      let dropName = this.fileItemService.isFile(this.value) && this.value.file.name ? this.value.file.name : this.value.url;

      if (dropName.length > 26) {
        return dropName.slice(0, 26) + '...';
      } else {
        return dropName;
      }
    } else {
      return undefined;
    }
  }

  public ngOnDestroy(): void {
    this.fileChange.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  public writeValue(value: any): void {
    this.value = value;
    this.changeDetector.markForCheck();
  }

  public validate(control: AbstractControl): { [key: string]: any } {
    if (!this.control) {
      this.control = control;
    }

    return undefined;
  }

  public emitClick(): void {
    this.fileClick.emit({
      file: this.value
    });
  }

  private emitFileChangeEvent(currentFile: SkyFileItem): void {
    if (currentFile && !currentFile.errorType) {
      this.writeValue(currentFile);
    }
    this.fileChange.emit({
      file: currentFile
    } as SkyFileAttachmentChange);

    this.inputEl.nativeElement.value = '';
  }

  private loadFile(file: SkyFileItem): void {
    const reader = new FileReader();

    reader.addEventListener('load', (event: any): void => {
      file.url = event.target.result;
      this.emitFileChangeEvent(file);
    });

    reader.addEventListener('error', (event: any): void => {
      this.emitFileChangeEvent(file);
    });

    reader.addEventListener('abort', (event: any): void => {
      this.emitFileChangeEvent(file);
    });

    reader.readAsDataURL(file.file);
  }

  private handleFiles(files: FileList): void {
    // tslint:disable-next-line: max-line-length
    let processedFiles = this.fileAttachmentService.checkFiles(files, this.minFileSize, this.maxFileSize, this.acceptedTypes, this.validateFn);

    for (let file of processedFiles) {
      if (file.errorType) {
        this.emitFileChangeEvent(file);
      } else {
        this.loadFile(file);
      }
    }
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
}
