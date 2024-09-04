import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SkyAppWindowRef, SkyIdService, SkyLogService } from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';
import {
  SkyToken,
  SkyTokensMessage,
  SkyTokensMessageType,
} from '@skyux/indicators';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';
import { SkyThemeService } from '@skyux/theme';

import { Observable, Subject, fromEvent as observableFromEvent } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyAutocompleteInputDirective } from '../autocomplete/autocomplete-input.directive';
import { SkyAutocompleteMessage } from '../autocomplete/types/autocomplete-message';
import { SkyAutocompleteMessageType } from '../autocomplete/types/autocomplete-message-type';
import { SkyAutocompleteSearchAsyncArgs } from '../autocomplete/types/autocomplete-search-async-args';
import { SkyAutocompleteSelectionChange } from '../autocomplete/types/autocomplete-selection-change';
import { SkyAutocompleteShowMoreArgs } from '../autocomplete/types/autocomplete-show-more-args';
import { SkySelectionModalService } from '../selection-modal/selection-modal.service';
import { SkySelectionModalInstance } from '../selection-modal/types/selection-modal-instance';

import { SkyLookupAdapterService } from './lookup-adapter.service';
import { SkyLookupAutocompleteAdapter } from './lookup-autocomplete-adapter';
import { SkyLookupShowMoreModalComponent } from './lookup-show-more-modal.component';
import { SkyLookupAddCallbackArgs } from './types/lookup-add-click-callback-args';
import { SkyLookupAddClickEventArgs } from './types/lookup-add-click-event-args';
import { SkyLookupSelectModeType } from './types/lookup-select-mode-type';
import { SkyLookupShowMoreConfig } from './types/lookup-show-more-config';
import { SkyLookupShowMoreNativePickerContext } from './types/lookup-show-more-native-picker-context';

@Component({
  selector: 'sky-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  providers: [SkyLookupAdapterService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLookupComponent
  extends SkyLookupAutocompleteAdapter
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  /**
   * The ARIA label for the typeahead search input. This sets the input's `aria-label` attribute to provide a text equivalent for
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the input includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @deprecated Use the input box `labelText` input instead.
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The HTML element ID of the element that labels
   * the typeahead search input. This sets the input's `aria-labelledby` attribute to provide a text equivalent for
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the input does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   * @deprecated Use the input box `labelText` input instead.
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * The value for the `autocomplete` attribute on the form input.
   * @default 'off'
   * @deprecated SKY UX only supports browser autofill on components where the direct input matches the return value. This input may not behave as expected due to the dropdown selection interaction.
   */
  @Input()
  public autocompleteAttribute: string | undefined;

  /**
   * The data source for the lookup component to search when users
   * enter text. You can specify static data such as an array of objects, or
   * you can pull data from a database.
   * @default []
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide data to the lookup component.
   */
  @Input()
  public set data(value: any[] | undefined) {
    this.#_data = value;

    if (this.#openNativePicker && !this.#hasSearchAsync()) {
      this.#openNativePicker.componentInstance.updateItemData(value);
    }
  }

  public get data(): any[] {
    return this.#_data || [];
  }

  /**
   * Whether to disable the lookup field on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value ?? false;
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Whether to enable users to open a picker where they can view all options.
   * @default false
   */
  @Input()
  public set enableShowMore(value: boolean | undefined) {
    this.#_enableShowMore = value ?? false;
  }

  public get enableShowMore(): boolean {
    return this.#_enableShowMore;
  }

  /**
   * Placeholder text to display in the lookup field.
   */
  @Input()
  public placeholderText: string | undefined;

  /**
   * The object property that represents the object's unique identifier.
   * Specifying this property enables token animations and more efficient rendering.
   * This property is required when using `enableShowMore` and `searchAsync` together.
   */
  @Input()
  public idProperty: string | undefined;

  /**
   * Whether to display a button that lets users add options to the list.
   * @default false
   */
  @Input()
  public set showAddButton(value: boolean | undefined) {
    this.#_showAddButton = value ?? false;
  }

  public get showAddButton(): boolean {
    return this.#_showAddButton;
  }

  /**
   * Configuration options for the picker that displays all options.
   */
  @Input()
  public showMoreConfig: SkyLookupShowMoreConfig | undefined;

  /**
   * The ability for users to select one option or multiple options.
   * @default "multiple"
   */
  @Input()
  public set selectMode(value: SkyLookupSelectModeType | undefined) {
    const multipleToSingle: boolean =
      value === 'single' && this.selectMode === 'multiple';

    this.#_selectMode = value;
    this.#updateForSelectMode();

    if (multipleToSingle) {
      if (this.value && this.value.length > 1) {
        // The `setTimeout` is needed to avoid a `ExpressionChangedAfterItHasBeenCheckedError` error in template forms.
        setTimeout(() => {
          this.writeValue([this.value[0]]);
          this.#changeDetector.detectChanges();
        });
      }
    }
  }

  public get selectMode(): SkyLookupSelectModeType {
    return this.#_selectMode || 'multiple';
  }

  /**
   * @internal
   */
  @Input()
  public wrapperClass: string | undefined;

  /**
   * Fires when users select the button to add options to the list.
   */
  @Output()
  public addClick = new EventEmitter<SkyLookupAddClickEventArgs>();

  /**
   * @internal
   */
  @Output()
  public openChange = new EventEmitter<boolean>();

  public get tokens(): SkyToken[] | undefined {
    return this.#_tokens;
  }

  public set tokens(value: SkyToken[] | undefined) {
    // Collapse the tokens into a single token if the user has selected many options.
    if (this.enableShowMore && this.value.length > 5) {
      this.#resourcesService
        .getString('skyux_lookup_tokens_summary', this.value.length.toString())
        .pipe(take(1))
        .subscribe((label) => {
          this.#_tokens = [
            {
              value: { [this.descriptorProperty]: label },
            },
          ];
          this.#changeDetector.markForCheck();
        });
    } else {
      this.#_tokens = value;
      this.#changeDetector.markForCheck();
    }
  }

  public get value(): any[] {
    return this.#_value ? this.#_value : [];
  }

  public set value(newValue: any[]) {
    this.#_value = newValue;

    if (!this.#pickerModalOpen()) {
      this.tokens = this.#parseTokens(newValue);
    }

    this.onChange(this.#_value);
    this.onTouched();
  }

  public autocompleteController = new Subject<SkyAutocompleteMessage>();
  public isInputFocused = false;
  public showMorePickerId: string | undefined;
  public tokensController = new Subject<SkyTokensMessage>();
  protected controlId: string | undefined;
  protected ariaDescribedBy: Observable<string | undefined> | undefined;

  @ViewChild(SkyAutocompleteInputDirective, {
    read: SkyAutocompleteInputDirective,
    static: false,
  })
  public set autocompleteInputDirective(
    value: SkyAutocompleteInputDirective | undefined,
  ) {
    this.#_autocompleteInputDirective = value;
    this.#updateForSelectMode();
  }

  public get autocompleteInputDirective():
    | SkyAutocompleteInputDirective
    | undefined {
    return this.#_autocompleteInputDirective;
  }

  @ViewChild('showMoreButtonTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public showMoreButtonTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('lookupWrapper', {
    read: ElementRef,
  })
  public lookupWrapperRef: ElementRef | undefined;

  @ViewChild('searchIconTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public searchIconTemplateRef: TemplateRef<unknown> | undefined;

  #idle = new Subject<void>();
  #markForTokenFocusOnKeyUp = false;
  #ngUnsubscribe = new Subject<void>();
  #openNativePicker: SkyModalInstance | undefined;
  #openSelectionModal: SkySelectionModalInstance | undefined;

  #_autocompleteInputDirective: SkyAutocompleteInputDirective | undefined;
  #_data: any[] | undefined;
  #_disabled = false;
  #_enableShowMore = false;
  #_selectMode: SkyLookupSelectModeType | undefined;
  #_showAddButton = false;
  #_tokens: SkyToken[] | undefined;
  #_value: any[] | undefined;

  readonly #adapter = inject(SkyLookupAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #elementRef = inject(ElementRef);
  readonly #idService = inject(SkyIdService);
  readonly #logSvc = inject(SkyLogService);
  readonly #modalService = inject(SkyModalService);
  readonly #resourcesService = inject(SkyLibResourcesService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);
  readonly #windowRef = inject(SkyAppWindowRef);

  constructor(
    @Self() @Optional() ngControl?: NgControl,
    @Optional() public inputBoxHostSvc?: SkyInputBoxHostService,
    @Optional() public themeSvc?: SkyThemeService,
  ) {
    super();

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.controlId = this.inputBoxHostSvc.controlId;
      this.ariaDescribedBy = this.inputBoxHostSvc.ariaDescribedBy;

      console.log('populating with');
      console.log(this.inputTemplateRef);
      console.log(this.inputTemplateRef.elementRef);
      console.log(this.inputTemplateRef.elementRef.nativeElement);

      this.inputBoxHostSvc.populate({
        inputTemplate: this.inputTemplateRef,
        buttonsTemplate: this.enableShowMore
          ? this.showMoreButtonTemplateRef
          : undefined,
        iconsInsetTemplate: this.enableShowMore
          ? undefined
          : this.searchIconTemplateRef,
      });
    } else {
      this.controlId = this.#idService.generateId();
    }

    /* istanbul ignore else */
    if (this.themeSvc) {
      // This is required for the autocomplete directive to be set after elements
      // are rearranged when switching themes.
      this.themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#changeDetector.markForCheck();
        });
    }
  }

  public ngAfterViewInit(): void {
    if (!this.disabled) {
      this.#addEventListeners();
    }
  }

  public ngOnDestroy(): void {
    this.#removeEventListeners();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.addClick.complete();
    this.openChange.complete();
    this.tokensController.complete();
  }

  public addButtonClicked(): void {
    this.addClick.emit({
      itemAdded: (args: SkyLookupAddCallbackArgs) =>
        this.#onAddButtonComplete(args),
    });
  }

  public onAutocompleteSelectionChange(
    change: SkyAutocompleteSelectionChange,
  ): void {
    /* istanbul ignore else */
    if (change.selectedItem) {
      this.#addToSelected(change.selectedItem);
    } else if (this.selectMode === 'single') {
      this.writeValue([]);
    }
  }

  public onAutocompleteBlur(): void {
    this.onTouched();
  }

  public onTokensChange(change: SkyToken[]): void {
    if (!change) {
      return;
    }

    if (this.tokens !== change) {
      if (change.length === 0) {
        this.#focusInput();
      }

      // NOTE: We do this here instead of just using the `value` setter because we need to use the
      // set of tokens returned here for the purposes of setting focus (see `onTokensKeyUp`).
      this.#_value = change.map((token) => {
        return token.value;
      });
      this.tokens = change;
      this.onChange(this.#_value);
      this.onTouched();
    }
  }

  public onTokensFocusIndexOverRange(): void {
    this.#windowRef.nativeWindow.setTimeout(() => {
      this.#focusInput();
    });
  }

  public onTokensKeyUp(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (this.selectMode !== 'single') {
      switch (event.key) {
        case 'Backspace':
          this.#sendTokensMessage(SkyTokensMessageType.RemoveActiveToken);
          this.#sendTokensMessage(SkyTokensMessageType.FocusPreviousToken);
          event.preventDefault();
          break;

        case 'Del':
        case 'Delete':
          this.#sendTokensMessage(SkyTokensMessageType.RemoveActiveToken);
          this.#windowRef.nativeWindow.setTimeout(() => {
            this.#sendTokensMessage(SkyTokensMessageType.FocusActiveToken);
          });
          event.preventDefault();
          break;
      }
    }
  }

  public onTokensRendered(): void {
    this.#sendAutocompleteMessage(
      SkyAutocompleteMessageType.RepositionDropdown,
    );
  }

  public writeValue(value: any[]): void {
    // Since we are dealing with arrays - clone the array being sent in to ensure we aren't modifying a consumers outer array
    this.value = value ? value.slice() : [];
    this.#updateForSelectMode();
  }

  // Angular automatically constructs these methods.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onChange = (value: any[]) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  public setDisabledState(disabled: boolean): void {
    this.#removeEventListeners();

    if (!disabled) {
      this.#addEventListeners();
    }

    this.disabled = disabled;
    this.#changeDetector.markForCheck();
  }

  public clearSearchText(): void {
    if (this.autocompleteInputDirective) {
      this.autocompleteInputDirective.value = undefined;
      this.autocompleteInputDirective.inputTextValue = '';
    }
  }

  // Handles when to focus on the tokens.
  // Check for empty search text on keydown, before the escape key is fully pressed.
  // (Otherwise, a single character being escaped would register as empty on keyup.)
  // If empty on keydown, set a flag so that the appropriate action can be taken on keyup.
  public inputKeydown(event: KeyboardEvent): void {
    const value = (event.target as HTMLTextAreaElement).value;

    /* Sanity check as this should only be called when in multiple select mode */
    /* istanbul ignore else */
    if (this.selectMode !== 'single') {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          break;
        case 'ArrowLeft':
        case 'Backspace':
        case 'Left':
          if (value) {
            this.#markForTokenFocusOnKeyUp = false;
          } else {
            this.#markForTokenFocusOnKeyUp = true;
          }
          break;
        default:
      }
    }
  }

  public inputKeyup(event: KeyboardEvent): void {
    /* Sanity check as this should only be called when in multiple select mode */
    /* istanbul ignore else */
    if (this.selectMode !== 'single') {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          this.clearSearchText();
          event.preventDefault();
          break;
        case 'ArrowLeft':
        case 'Backspace':
        case 'Left':
          /* istanbul ignore else */
          if (this.#markForTokenFocusOnKeyUp) {
            this.#sendTokensMessage(SkyTokensMessageType.FocusLastToken);
            event.preventDefault();
          }
          break;
        default:
      }

      event.stopPropagation();
    }
  }

  public onSearchButtonClick(): void {
    /*istanbul ignore next*/
    if (this.disabled) {
      return;
    }
    this.#sendAutocompleteMessage(SkyAutocompleteMessageType.CloseDropdown);
    let isValueInTextBox = false;
    if (this.selectMode === 'single') {
      isValueInTextBox =
        this.autocompleteInputDirective?.value &&
        this.autocompleteInputDirective.inputTextValue ===
          this.autocompleteInputDirective.value[this.descriptorProperty];
    }

    let searchValue = '';

    if (!isValueInTextBox && this.autocompleteInputDirective) {
      searchValue = this.autocompleteInputDirective.inputTextValue;
    }

    this.openPicker(searchValue);
    this.autocompleteInputDirective?.restoreInputTextValueToPreviousState();
  }

  public onShowMoreClick(event: SkyAutocompleteShowMoreArgs): void {
    /* Sanity check */
    /* istanbul ignore else*/
    if (event) {
      this.openPicker(event.inputValue);
    }
  }

  public openPicker(initialSearch: string): void {
    if (this.showMoreConfig?.customPicker) {
      this.showMorePickerId = undefined;

      this.showMoreConfig.customPicker.open({
        items: this.data,
        initialSearch,
        initialValue: this.value,
      });
    } else {
      const initialValue = this.value;

      if (this.#hasSearchAsync()) {
        this.#openSelectionModal =
          this.#createSelectionModalInstance(initialSearch);

        this.showMorePickerId = this.#openSelectionModal.id;

        this.#openSelectionModal.closed.subscribe((closeArgs) => {
          this.#processPickerResult(
            closeArgs.reason === 'save'
              ? closeArgs.selectedItems
              : initialValue,
          );
        });
      } else {
        this.#openNativePicker =
          this.#createNativePickerInstance(initialSearch);

        this.showMorePickerId = this.#openNativePicker.componentInstance.id;

        this.#openNativePicker.componentInstance.addClick.subscribe(() => {
          this.addButtonClicked();
        });

        this.#openNativePicker.closed.subscribe((closeArgs) => {
          let selectedItems: any[];

          if (closeArgs.reason === 'save') {
            selectedItems = [];

            this.data.forEach((item: any, dataIndex: number) => {
              if (
                closeArgs.data.some((savedItem: any) => {
                  return savedItem.index === dataIndex;
                })
              ) {
                selectedItems.push(item);
              }
            });
          } else {
            selectedItems = initialValue;
          }

          this.#processPickerResult(selectedItems);
        });

        this.#changeDetector.markForCheck();
      }
    }
  }

  protected onAutocompleteOpenChange($event: boolean): void {
    if ($event) {
      this.openChange.emit(true);
    } else if (!this.#pickerModalOpen()) {
      this.openChange.emit(false);
    }
  }

  #createSelectionModalInstance(
    initialSearch: string,
  ): SkySelectionModalInstance {
    const initialValue = this.value;
    const modalConfig = this.showMoreConfig?.nativePickerConfig || {};

    if (!modalConfig.itemTemplate) {
      modalConfig.itemTemplate = this.searchResultTemplate;
    }

    if (this.idProperty === undefined) {
      this.#logSvc.error(
        "The lookup component's 'idProperty' input is required when `enableShowMore` and 'searchAsync' are used together.",
      );
    }

    return this.#selectionModalSvc.open({
      descriptorProperty: this.descriptorProperty,
      idProperty: this.idProperty!,
      searchAsync: (args) => {
        const searchAsyncArgs: SkyAutocompleteSearchAsyncArgs = {
          displayType: 'modal',
          offset: args.offset,
          searchText: args.searchText,
          continuationData: args.continuationData,
        };

        this.searchAsync.emit(searchAsyncArgs);

        return searchAsyncArgs.result;
      },
      selectMode: this.selectMode,
      addClick: () => {
        this.addButtonClicked();
      },
      initialSearch,
      itemTemplate: modalConfig.itemTemplate,
      selectionDescriptor: modalConfig.selectionDescriptor,
      showAddButton: this.showAddButton,
      title: modalConfig.title,
      value: initialValue,
      wrapperClass: this.wrapperClass,
    });
  }

  #createNativePickerInstance(initialSearch: string): SkyModalInstance {
    const initialValue = this.value;
    const modalConfig = this.showMoreConfig?.nativePickerConfig || {};

    if (!modalConfig.itemTemplate) {
      modalConfig.itemTemplate = this.searchResultTemplate;
    }

    if (!modalConfig.selectionDescriptor) {
      modalConfig.selectionDescriptor =
        this.selectMode === 'single' ? 'item' : 'items';
    }

    const contextProviderValue = new SkyLookupShowMoreNativePickerContext(
      this.descriptorProperty,
      initialSearch,
      initialValue,
      this.data,
      this.searchOrDefault,
      this.selectMode,
      this.showAddButton,
      modalConfig,
    );

    return this.#modalService.open(SkyLookupShowMoreModalComponent, {
      providers: [
        {
          provide: SkyLookupShowMoreNativePickerContext,
          useValue: contextProviderValue,
        },
        {
          provide: SkyLookupAdapterService,
          useValue: this.#adapter,
        },
      ],
      size: 'large',
      wrapperClass: this.wrapperClass,
    });
  }

  #processPickerResult(selectedItems: any[] | undefined): void {
    this.#openSelectionModal = undefined;
    this.#openNativePicker = undefined;
    this.showMorePickerId = undefined;

    /* istanbul ignore next */
    selectedItems = selectedItems || [];

    this.writeValue(selectedItems);
    this.#focusInput();
    this.#changeDetector.markForCheck();
  }

  public onSearchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    this.searchAsync.emit(args);
  }

  #addToSelected(item: any): void {
    let selectedItems: any[];

    if (this.selectMode === 'single') {
      selectedItems = [item];
    } else {
      selectedItems = this.value;

      const idProperty = this.idProperty || '';

      // If items have a unique identifier, don't allow the same item to be added twice.
      if (
        !this.idProperty ||
        !this.value.some(
          (existingItem) => existingItem[idProperty] === item[idProperty],
        )
      ) {
        selectedItems.push(item);
      }

      this.clearSearchText();
    }

    this.writeValue(selectedItems);
  }

  #addEventListeners(): void {
    this.#idle = new Subject();
    this.#focusInputOnHostClick();
  }

  #removeEventListeners(): void {
    this.#idle.next();
    this.#idle.complete();
  }

  #focusInputOnHostClick(): void {
    let hostElement = !this.inputBoxHostSvc
      ? this.#elementRef.nativeElement
      : this.lookupWrapperRef?.nativeElement;
    const documentObj = this.#windowRef.nativeWindow.document;

    // Handles focusing the input when the host is clicked.
    // The input should NOT be focused if other elements (tokens, etc.)
    // are currently focused or being tabbed through.

    observableFromEvent<MouseEvent>(documentObj, 'click')
      .pipe(takeUntil(this.#idle))
      .subscribe(() => {
        hostElement = !this.inputBoxHostSvc
          ? this.#elementRef.nativeElement
          : this.lookupWrapperRef?.nativeElement;
        this.isInputFocused = hostElement.contains(document.activeElement);

        this.#changeDetector.markForCheck();
      });

    observableFromEvent<KeyboardEvent>(documentObj, 'focusin')
      .pipe(takeUntil(this.#idle))
      .subscribe(() => {
        hostElement = !this.inputBoxHostSvc
          ? this.#elementRef.nativeElement
          : this.lookupWrapperRef?.nativeElement;
        this.isInputFocused = hostElement.contains(document.activeElement);

        this.#changeDetector.markForCheck();
      });

    if (hostElement) {
      observableFromEvent(hostElement, 'mouseup')
        .pipe(takeUntil(this.#idle))
        .subscribe(() => {
          const classList = documentObj.activeElement.classList;
          if (!classList || !classList.contains('sky-token')) {
            this.#focusInput();
          }
        });
    }
  }

  #focusInput(): void {
    if (this.lookupWrapperRef) {
      this.#adapter.focusInput(this.lookupWrapperRef);
    }
  }

  #onAddButtonComplete(args: SkyLookupAddCallbackArgs): void {
    if (this.#openSelectionModal) {
      // Notify the selection modal of the new item. The selection
      // modal will decide whether the new item should be added
      // to the value when the user confirms or cancels the
      // selection modal.
      this.#openSelectionModal.addItem(args.item);
    } else {
      let addItemToValue: boolean | undefined;

      if (this.#hasSearchAsync()) {
        addItemToValue = true;
      } else {
        if (args.data) {
          this.data = args.data;
        }

        if (this.data.indexOf(args.item) >= 0) {
          if (this.#openNativePicker) {
            // Notify the picker of the new item. The picker will
            // decide whether the new item should be added to the
            // value when the user confirms or cancels the picker.
            (
              this.#openNativePicker
                .componentInstance as SkyLookupShowMoreModalComponent
            ).onItemSelect(true, { value: args.item, selected: false });
          } else {
            addItemToValue = true;
          }
        }
      }

      if (addItemToValue) {
        const newValue =
          this.selectMode === 'multiple'
            ? this.value.concat(args.item)
            : [args.item];
        this.writeValue(newValue);
      }
    }
  }

  #parseTokens(data: any[]): SkyToken[] {
    return data.map((item: any) => {
      return {
        value: item,
      };
    });
  }

  #sendAutocompleteMessage(type: SkyAutocompleteMessageType): void {
    this.autocompleteController.next({ type });
  }

  #sendTokensMessage(type: SkyTokensMessageType): void {
    this.tokensController.next({ type });
  }

  #updateForSelectMode(): void {
    if (this.autocompleteInputDirective) {
      if (this.selectMode === 'single') {
        this.autocompleteInputDirective.value = this.value && this.value[0];
      } else {
        this.clearSearchText();
      }
    }
  }

  #hasSearchAsync(): boolean {
    return this.searchAsync.observers.length > 0;
  }

  #pickerModalOpen(): boolean {
    return !!(this.#openNativePicker || this.#openSelectionModal);
  }
}
