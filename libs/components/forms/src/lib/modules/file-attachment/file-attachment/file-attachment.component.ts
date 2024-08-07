import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
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
  Signal,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
  numberAttribute,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {
  SkyIdModule,
  SkyIdService,
  SkyLiveAnnouncerService,
} from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { Subject, of } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { SkyFormErrorComponent } from '../../form-error/form-error.component';
import { SKY_FORM_ERRORS_ENABLED } from '../../form-error/form-errors-enabled-token';
import { SkyFormErrorsComponent } from '../../form-error/form-errors.component';
import { SkyFormFieldLabelTextRequiredService } from '../../shared/form-field-label-text-required.service';
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
import { SkyFileAttachmentLabelService } from './file-attachment-label.service';
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
    NgOptimizedImage,
    SkyFileAttachmentJoinIdsPipe,
    SkyFileSizePipe,
    SkyFormErrorComponent,
    SkyFormErrorsComponent,
    SkyFormsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyThemeModule,
  ],
  providers: [
    SkyFileAttachmentLabelService,
    SkyFileAttachmentService,
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
    {
      provide: NG_VALIDATORS,
      useExisting: SkyFileAttachmentComponent,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SkyFileAttachmentComponent,
      multi: true,
    },
  ],
  selector: 'sky-file-attachment',
  standalone: true,
  styleUrl: './file-attachment.component.scss',
  template: `
    <div class="sky-file-attachment-wrapper">
      @let legacyLabelId = legacyLabelSvc.elementId | async;

      <div
        class="sky-file-attachment-label-wrapper"
        skyId
        [ngClass]="{
          'sky-control-label-required':
            !labelText && isRequired() && legacyLabelId,
        }"
        #labelRef
      >
        @if (labelText) {
          @if (!labelHidden) {
            <span
              class="sky-control-label sky-margin-inline-xs"
              [ngClass]="{
                'sky-control-label-required': isRequired(),
              }"
              >{{ labelText }}</span
            >
          }

          @if (helpPopoverContent || helpKey) {
            <sky-help-inline
              [helpKey]="helpKey"
              [labelText]="labelText"
              [popoverContent]="helpPopoverContent"
              [popoverTitle]="helpPopoverTitle"
            />
          }
        } @else {
          <ng-content select="sky-file-attachment-label" />
        }

        @if (isRequired() && (legacyLabelId || labelText)) {
          <span class="sky-screen-reader-only">{{
            'skyux_file_attachment_required' | skyLibResources
          }}</span>
        }
      </div>

      <div
        class="sky-file-attachment-upload sky-file-attachment sky-file-attachment-target"
        [ngClass]="{
          'sky-file-attachment-accept': fileDragAccepted,
          'sky-file-attachment-reject': fileDragRejected,
        }"
        (dragenter)="onFileDragEnter($event)"
        (dragleave)="onFileDragLeave($event)"
        (dragover)="onFileDragOver($event)"
        (drop)="onFileDragDrop($event)"
      >
        <input
          hidden
          tabindex="-1"
          type="file"
          [attr.accept]="acceptedTypes || null"
          [disabled]="disabled"
          [required]="isRequired()"
          (change)="onFileChange($event)"
        />

        @if (!(value && isModernTheme())) {
          <button
            class="sky-file-attachment-btn sky-btn sky-btn-default"
            type="button"
            [attr.aria-describedby]="
              (hintText ? hintTextRef.id : null)
                | skyFileAttachmentJoinIds: fileDropDescriptionRef.id
            "
            [attr.aria-labelledby]="
              attachFileButtonLabelRef.id
                | skyFileAttachmentJoinIds
                  : (labelText ? labelRef.id : legacyLabelId)
            "
            [disabled]="disabled"
            (click)="onFileAttachClick()"
          >
            <sky-icon icon="folder-open-o" />
            {{
              value
                ? ('skyux_file_attachment_button_label_replace_file'
                  | skyLibResources)
                : ('skyux_file_attachment_button_label_choose_file'
                  | skyLibResources)
            }}
          </button>
        }

        @if (value && !isImage && isModernTheme()) {
          <sky-icon
            class="sky-file-attachment-icon sky-deemphasized"
            icon="file-o"
            size="2x"
          />
        }

        @if (value || !isModernTheme()) {
          <span class="sky-file-attachment-name">
            @if (value) {
              <a [attr.title]="fileName" (click)="onFileNameClick()">
                {{ truncatedFileName }}
              </a>
            } @else {
              <span class="sky-file-attachment-none sky-deemphasized">
                {{
                  'skyux_file_attachment_label_no_file_chosen' | skyLibResources
                }}
              </span>
            }
          </span>
        }

        @if (value) {
          <button
            class="sky-btn sky-btn-borderless sky-file-attachment-delete"
            type="button"
            [attr.aria-labelledby]="
              removeFileButtonLabelRef.id
                | skyFileAttachmentJoinIds: legacyLabelId
            "
            [disabled]="disabled"
            [skyThemeClass]="{
              'sky-btn-icon-borderless': 'modern',
            }"
            (click)="onFileRemoveClick()"
          >
            <sky-icon icon="trash-o" size="md" />
          </button>
        }
      </div>

      @if (value && isImage) {
        <img
          class="sky-file-attachment-preview-img"
          [alt]="
            'skyux_file_attachment_file_upload_image_preview_alt_text'
              | skyLibResources
          "
          [ngSrc]="value.url"
        />
      }
    </div>

    <div skyId #hintTextRef>
      @if (hintText) {
        <div class="sky-font-deemphasized sky-file-attachment-hint-text">
          {{ hintText }}
        </div>
      }
    </div>

    @if (labelText && (hostControl?.errors || fileErrors)) {
      <sky-form-errors
        [errors]="
          hostControl?.errors !== null ? hostControl?.errors : fileErrors
        "
        [labelText]="labelText"
        [showErrors]="hostControl?.touched || hostControl?.dirty"
      >
        <ng-content select="sky-form-error" />

        @if (fileErrorName === 'fileType') {
          <sky-form-error
            errorName="fileType"
            [errorText]="
              acceptedTypesErrorMessage ??
                'skyux_file_attachment_file_type_error_label_text'
                | skyLibResources: fileErrorParam
            "
          />
        }

        @if (fileErrorName === 'maxFileSize') {
          <sky-form-error
            errorName="maxFileSize"
            [errorText]="
              'skyux_file_attachment_max_file_size_error_label_text'
                | skyLibResources: (fileErrorParam | skyFileSize)
            "
          />
        }

        @if (fileErrorName === 'minFileSize') {
          <sky-form-error
            errorName="minFileSize"
            [errorText]="
              'skyux_file_attachment_min_file_size_error_label_text'
                | skyLibResources: (fileErrorParam | skyFileSize)
            "
          />
        }
      </sky-form-errors>
    }

    <div
      aria-hidden="true"
      class="sky-screen-reader-only"
      skyId
      #fileDropDescriptionRef
    >
      {{ 'skyux_file_attachment_file_upload_drag_or_click' | skyLibResources }}
    </div>

    <div
      aria-hidden="true"
      class="sky-screen-reader-only"
      skyId
      #attachFileButtonLabelRef
    >
      {{
        value
          ? ('skyux_file_attachment_button_label_replace_file_label'
            | skyLibResources: fileName)
          : ('skyux_file_attachment_button_label_choose_file_label'
            | skyLibResources)
      }}
    </div>

    <div
      aria-hidden="true"
      class="sky-screen-reader-only"
      skyId
      #removeFileButtonLabelRef
    >
      {{ 'skyux_file_attachment_file_item_remove' | skyLibResources: fileName }}
    </div>
  `,
})
export class SkyFileAttachmentComponent
  implements ControlValueAccessor, Validator
{
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
   * Whether to disable the input on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   */
  @Input({ transform: booleanAttribute })
  public disabled = false;

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the single file attachment label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the single file attachment label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
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
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public hintText: string | undefined;

  /**
   * Whether to hide `labelText` from view.
   */
  @Input({ transform: booleanAttribute })
  public labelHidden = false;

  /**
   * The text to display as the file attachment's label.
   */
  @Input()
  public labelText: string | undefined;

  @Input({
    transform: (value: unknown) => {
      return numberAttribute(value, MAX_FILE_SIZE_DEFAULT);
    },
  })
  public maxFileSize!: number;

  @Input({
    transform: (value: unknown) => {
      return numberAttribute(value, MIN_FILE_SIZE_DEFAULT);
    },
  })
  public minFileSize!: number;

  /**
   * Whether the input is required for form validation.
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * Whether the single file attachment is stacked on another form component. When specified,
   * the appropriate vertical spacing is automatically added to the single file attachment.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-margin-stacked-lg')
  public stacked = false;

  /**
   * The custom validation function. This validation runs alongside the internal
   * file validation. This function takes a `SkyFileItem` object as a parameter.
   */
  @Input()
  public validateFn: SkyFileValidateFn | undefined;

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

  protected fileDragAccepted = false;
  protected fileDragRejected = false;
  protected fileErrorName: SkyFileItemErrorType | undefined;
  protected fileErrorParam: string | undefined;
  protected fileErrors: ValidationErrors | null | undefined;
  protected fileName = '';
  protected hostControl: AbstractControl | undefined;
  protected isImage = false;
  protected isModernTheme: Signal<boolean | undefined>;
  protected truncatedFileName = '';
  protected value: SkyFileItem | undefined;

  protected readonly legacyLabelSvc = inject(SkyFileAttachmentLabelService, {
    self: true,
  });

  readonly #themeSvc = inject(SkyThemeService, { optional: true });

  #notifyChange: ((_: SkyFileItem) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);

  constructor() {
    this.isModernTheme = toSignal(
      this.#themeSvc?.settingsChange.pipe(
        map((change) => change.currentSettings?.theme.name === 'modern'),
      ) ?? of(false),
    );
  }

  public writeValue(value: unknown): void {}

  public registerOnChange(fn: (_: SkyFileItem) => void): void {
    this.#notifyChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    this.hostControl ??= control;

    return null;
  }

  protected isRequired(): boolean {
    return (
      this.required || !!this.hostControl?.hasValidator(Validators.required)
    );
  }

  protected onFileAttachClick(): void {}

  protected onFileChange(evt: Event): void {}

  protected onFileDragDrop(evt: DragEvent): void {}

  protected onFileDragEnter(evt: DragEvent): void {}

  protected onFileDragLeave(evt: DragEvent): void {}

  protected onFileDragOver(evt: DragEvent): void {}

  protected onFileNameClick(): void {}

  protected onFileRemoveClick(): void {}
}
