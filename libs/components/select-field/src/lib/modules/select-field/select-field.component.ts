import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SkyLogService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyToken, SkyTokensModule } from '@skyux/indicators';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { Observable, of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkySelectFieldResourcesModule } from '../shared/sky-select-field-resources.module';

import { SkySelectFieldPickerContext } from './select-field-picker-context';
import { SkySelectFieldPickerComponent } from './select-field-picker.component';
import { SkySelectField } from './types/select-field';
import { SkySelectFieldCustomPicker } from './types/select-field-custom-picker';
import { SkySelectFieldSelectMode } from './types/select-field-select-mode';

/**
 * @deprecated `SkySelectFieldComponent` is deprecated. Use `SkyLookupComponent` instead.
 */
@Component({
  selector: 'sky-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkySelectFieldComponent),
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    SkyIconModule,
    SkySelectFieldResourcesModule,
    SkyTokensModule,
  ],
})
export class SkySelectFieldComponent
  implements ControlValueAccessor, OnDestroy
{
  /**
   * The ARIA label for the text input or button. This sets the `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the input or button includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string;

  /**
   * The HTML element ID of the element that labels
   * the text input or button. This sets the `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the input or button does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string;

  /**
   * Defines a data source to populate the modal picker with items that users can select.
   * This property accepts an observable array of `SkySelectField` values. The `SkySelectField`
   * type extends the any type and supports `id`, `label`, and `category` values.
   * @required
   */
  @Input()
  public data: Observable<SkySelectField[]>;

  /**
   * The `SkySelectFieldCustomPicker` object that displays a custom UI when users
   * select the select field button.
   */
  @Input()
  public customPicker: SkySelectFieldCustomPicker;

  /**
   * The property to highlight in the picker with bold text. The valid options are
   * the values that the `data` property injects into the component: `"id"`, `"label"`, and `"category"`.
   * @default "label"
   */
  @Input()
  public set descriptorKey(value: string) {
    this._descriptorKey = value;
  }

  public get descriptorKey(): string {
    return this._descriptorKey || 'label';
  }

  /**
   * Whether to disable the text input or button and prevent users
   * from opening the picker on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  /**
   * The selection mode that determines whether users can select one item
   * or multiple items. The valid options are `single`, which displays a text input,
   * and `multiple`, which displays a button.
   * @default "multiple"
   */
  @Input()
  public set selectMode(value: SkySelectFieldSelectMode) {
    this._selectMode = value;
  }

  public get selectMode(): SkySelectFieldSelectMode {
    return this._selectMode || 'multiple';
  }

  /**
   * The label for the button when `selectMode` is set to `multiple`.
   * @default "Select values"
   */
  @Input()
  public multipleSelectOpenButtonText: string;

  /**
   * Whether to use the default search function. To circumvent the list-builder search function
   * and provide search results from a remote source, set this property to `false` and specify the source
   * with the *data* property.
   * @default true
   */
  @Input()
  public inMemorySearchEnabled: boolean;

  /**
   * Tooltip text for the icon that clears the text input when `selectMode`
   * is set to `"single"`. The clear icon appears after users select an item.
   * @default "Clear selection"
   */
  @Input()
  public singleSelectClearButtonTitle: string;

  /**
   * Tooltip text for the text input when `selectMode` is set to `"single"`.
   * @default "Click to select a value"
   */
  @Input()
  public singleSelectOpenButtonTitle: string;

  /**
   * Placeholder text to display in the text input when `selectMode` is set to
   * `"single"` and no item is selected.
   * @default "Select a value"
   */
  @Input()
  public singleSelectPlaceholderText: string;

  /**
   * The header for the picker. When `selectMode` is set to `"single"`, the default
   * header is "Select a value." When `selectMode` is set to `"multiple"`, the default header
   * is "Select values."
   */
  @Input()
  public pickerHeading: string;

  /**
   * Whether to display a button in the picker for users to add items. Consumers
   * must tie into the `addNewRecordButtonClick` event and provide the logic to add items.
   * @default false
   */
  @Input()
  public showAddNewRecordButton = false;

  /**
   * Fires when the component loses focus. This event does not emit a value.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public blur = new EventEmitter();

  /**
   * Fires when users select the add button in the picker to add an item. The button appears
   * when when `showAddNewRecordButton` is set to `true`.
   */
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
    private elementRef: ElementRef,
    logger: SkyLogService,
  ) {
    logger.deprecated('SkySelectFieldComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl: 'https://developer.blackbaud.com/skyux/components/lookup',
      replacementRecommendation: 'Use `SkyLookupComponent` instead.',
    });
  }

  public ngOnDestroy(): void {
    this.blur.complete();
    this.addNewRecordButtonClick.complete();
  }

  public onTokensChange(change: SkyToken[]): void {
    if (!change || change === this.tokens) {
      return;
    }

    const newIds = change.map((token) => token.value.id);

    this.data.pipe(take(1)).subscribe((items: SkySelectField[]) => {
      const newValues = items.filter((item) => newIds.indexOf(item.id) > -1);
      this.value = newValues;
      this.setTokensFromValue();
      this.changeDetector.markForCheck();
    });
  }

  public openPicker(): void {
    (this.pickerHeading
      ? observableOf(this.pickerHeading)
      : this.resourcesService.getString(
          `skyux_select_field_${this.selectMode}_select_picker_heading`,
        )
    )
      .pipe(take(1))
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

  public writeValue(value: any): void {
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onChange = (value: any): void => {};

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._registeredTouchCallback = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  public clearSelection(): void {
    this.elementRef.nativeElement
      .querySelector('.sky-select-field-btn')
      .focus();
    this.value = undefined;
  }

  /* istanbul ignore next */
  private _registeredTouchCallback = (): void => {};

  private setTokensFromValue(): void {
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
      this.resourcesService
        .getString(
          'skyux_select_field_multiple_select_summary',
          this.value.length.toString(),
        )
        .pipe(take(1))
        .subscribe((label) => {
          this.tokens = [
            {
              value: {
                [this.descriptorKey]: label,
              },
            },
          ];
        });
    } else {
      this.tokens = this.value.map((value: any) => ({ value }));
    }
  }

  private openStandardPicker(pickerContext: SkySelectFieldPickerContext): void {
    const modalInstance = this.modalService.open(
      SkySelectFieldPickerComponent,
      {
        providers: [
          {
            provide: SkySelectFieldPickerContext,
            useValue: pickerContext,
          },
        ],
      },
    );

    const picker =
      modalInstance.componentInstance as SkySelectFieldPickerComponent;

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

  private openCustomPicker(pickerContext: SkySelectFieldPickerContext): void {
    this.isPickerOpen = true;
    this.customPicker.open(pickerContext, (value) => {
      if (this.selectMode === 'single') {
        this.writeValue(value[0]);
      } else {
        this.writeValue(value);
      }
      this.onTouched(false);
      this.isPickerOpen = false;
    });
  }
}
