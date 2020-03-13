import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  OnDestroy
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyModalService,
  SkyModalCloseArgs
} from '@skyux/modals';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyToken
} from '@skyux/indicators';

import {
  SkySelectField,
  SkySelectFieldCustomPicker,
  SkySelectFieldSelectMode
} from './types';

import {
  SkySelectFieldPickerContext
} from './select-field-picker-context';

import {
  SkySelectFieldPickerComponent
} from './select-field-picker.component';

@Component({
  selector: 'sky-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable-next-line:no-forward-ref */
      useExisting: forwardRef(() => SkySelectFieldComponent),
      multi: true
    }
  ]
})
export class SkySelectFieldComponent implements ControlValueAccessor, OnDestroy {
  @Input()
  public ariaLabel: string;

  @Input()
  public ariaLabelledBy: string;

  @Input()
  public data: Observable<SkySelectField[]>;

  @Input()
  public customPicker: SkySelectFieldCustomPicker;

  @Input()
  public set descriptorKey(value: string) {
    this._descriptorKey = value;
  }

  public get descriptorKey(): string {
    return this._descriptorKey || 'label';
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  @Input()
  public set selectMode(value: SkySelectFieldSelectMode) {
    this._selectMode = value;
  }

  public get selectMode(): SkySelectFieldSelectMode {
    return this._selectMode || 'multiple';
  }

  @Input()
  public multipleSelectOpenButtonText: string;

  /**
   * When `inMemorySearchEnabled` is `false`, it will circumvent the list-builder search function,
   * allowing consumers to provide results from a remote source, by updating the `data` value.
   * @default true
   */
  @Input()
  public inMemorySearchEnabled: boolean;

  @Input()
  public singleSelectClearButtonTitle: string;

  @Input()
  public singleSelectOpenButtonTitle: string;

  @Input()
  public singleSelectPlaceholderText: string;

  @Input()
  public pickerHeading: string;

  @Input()
  public showAddNewRecordButton: boolean = false;

  @Output()
  public blur = new EventEmitter();

  @Output()
  public addNewRecordButtonClick = new EventEmitter<void>();

  /**
   * Fires when a search is submitted from the picker's toolbar.
   */
  @Output()
  public searchApplied: EventEmitter<string> = new EventEmitter<string>();

  public get value(): any {
    return this._value;
  }

  public set value(value: any) {
    if (JSON.stringify(this._value) !== JSON.stringify(value)) {
      this._value = value;
      this.onChange(this.value);
    }
  }

  public get singleSelectModeValue(): string {
    const value = this.value;

    if (value) {
      return (value as any)[this.descriptorKey];
    }

    return '';
  }

  public tokens: SkyToken[];

  private _descriptorKey: string;
  private _disabled: boolean;
  private _selectMode: SkySelectFieldSelectMode;
  private _value: any;
  private isPickerOpen = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private modalService: SkyModalService,
    private resourcesService: SkyLibResourcesService,
    private elementRef: ElementRef
  ) { }

  public ngOnDestroy() {
    this.blur.complete();
    this.addNewRecordButtonClick.complete();
  }

  public onTokensChange(change: SkyToken[]) {
    if (!change || change === this.tokens) {
      return;
    }

    const newIds = change.map(token => token.value.id);

    this.data.take(1).subscribe((items: SkySelectField[]) => {
      const newValues = items.filter(item => newIds.indexOf(item.id) > -1);
      this.value = newValues;
      this.setTokensFromValue();
      this.changeDetector.markForCheck();
    });
  }

  public openPicker() {
    (
      this.pickerHeading ?
        Observable.of(this.pickerHeading) :
        this.resourcesService.getString(
          `skyux_select_field_${this.selectMode}_select_picker_heading`
        )
    )
      .take(1)
      .subscribe((headingText) => {
        const pickerContext = new SkySelectFieldPickerContext();
        pickerContext.headingText = headingText;
        pickerContext.data = this.data;
        pickerContext.selectedValue = this.value;
        pickerContext.selectMode = this.selectMode;
        pickerContext.showAddNewRecordButton = this.showAddNewRecordButton;
        pickerContext.inMemorySearchEnabled = this.inMemorySearchEnabled;

        if (this.customPicker) {
          this.openCustomPicker(pickerContext);
        } else {
          this.openStandardPicker(pickerContext);
        }
      });
  }

  public writeValue(value: any) {
    if (this.disabled) {
      return;
    }

    this.value = value;
    this.setTokensFromValue();
    this.changeDetector.markForCheck();
  }

  public onHostFocusOut(): void {
    if (!this.isPickerOpen) {
      this.onTouched();
    }
  }

  public onTouched(blur = true): void {
    this._registeredTouchCallback();

    if (blur) {
      this.blur.emit();
    }
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange = (value: any) => { };

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this._registeredTouchCallback = fn;
  }

  public setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  public clearSelection() {
    this.elementRef.nativeElement.querySelector('.sky-select-field-btn').focus();
    this.value = undefined;
  }

  /* istanbul ignore next */
  private _registeredTouchCallback = () => { };

  private setTokensFromValue() {
    // Tokens only appear for multiple select mode.
    if (this.selectMode === 'single') {
      return;
    }

    // Reset tokens if value has been changed to undefined.
    if (!this.value) {
      this.tokens = undefined;
      return;
    }

    // Collapse the tokens into a single token if the user has selected many options.
    if (this.value.length > 5) {
      this.resourcesService.getString(
        'skyux_select_field_multiple_select_summary',
        this.value.length.toString()
      )
        .take(1)
        .subscribe((label) => {
          this.tokens = [{
            value: {
              [this.descriptorKey]: label
            }
          }];
        });
    } else {
      this.tokens = this.value.map((value: any) => ({ value }));
    }
  }

  private openStandardPicker(pickerContext: SkySelectFieldPickerContext) {
    const modalInstance = this.modalService.open(SkySelectFieldPickerComponent, {
      providers: [{
        provide: SkySelectFieldPickerContext,
        useValue: pickerContext
      }]
    });

    const picker = modalInstance.componentInstance as SkySelectFieldPickerComponent;

    picker.searchApplied.subscribe((searchText: string) => {
      this.searchApplied.emit(searchText);
    });

    picker.addNewRecordButtonClick.subscribe(() => {
      this.addNewRecordButtonClick.emit();
    });

    this.isPickerOpen = true;

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        if (this.selectMode === 'single') {
          this.writeValue(result.data[0]);
        } else {
          this.writeValue(result.data);
        }
      }
      this.isPickerOpen = false;
      this.onTouched(false);
    });
  }

  private openCustomPicker(pickerContext: SkySelectFieldPickerContext) {
    this.isPickerOpen = true;
    this.customPicker.open(
      pickerContext,
      (value) => {
        if (this.selectMode === 'single') {
          this.writeValue(value[0]);
        } else {
          this.writeValue(value);
        }
        this.onTouched(false);
        this.isPickerOpen = false;
      }
    );
  }
}
