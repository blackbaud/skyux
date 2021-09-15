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
  ViewEncapsulation
} from '@angular/core';

import {
  ControlValueAccessor,
  NgControl
} from '@angular/forms';

import {
  fromEvent as observableFromEvent,
  Subject
} from 'rxjs';

import {
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyInputBoxHostService
} from '@skyux/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyToken,
  SkyTokensMessage,
  SkyTokensMessageType
} from '@skyux/indicators';

import {
  SkyModalInstance,
  SkyModalService
} from '@skyux/modals';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyAutocompleteMessage
} from '../autocomplete/types/autocomplete-message';

import {
  SkyAutocompleteMessageType
} from '../autocomplete/types/autocomplete-message-type';

import {
  SkyAutocompleteSelectionChange
} from '../autocomplete/types/autocomplete-selection-change';

import {
  SkyAutocompleteShowMoreArgs
} from '../autocomplete/types/autocomplete-show-more-args';

import {
  SkyAutocompleteInputDirective
} from '../autocomplete/autocomplete-input.directive';

import {
  SkyLookupAutocompleteAdapter
} from './lookup-autocomplete-adapter';

import {
  SkyLookupAdapterService
} from './lookup-adapter.service';

import {
  SkyLookupAddCallbackArgs
} from './types/lookup-add-click-callback-args';

import {
  SkyLookupAddClickEventArgs
} from './types/lookup-add-click-event-args';

import {
  SkyLookupShowMoreModalComponent
} from './lookup-show-more-modal.component';

import {
  SkyLookupSelectMode
} from './types/lookup-select-mode';

import {
  SkyLookupShowMoreConfig
} from './types/lookup-show-more-config';

import {
  SkyLookupShowMoreNativePickerContext
} from './types/lookup-show-more-native-picker-context';

@Component({
  selector: 'sky-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  providers: [
    SkyLookupAdapterService
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyLookupComponent
  extends SkyLookupAutocompleteAdapter
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  /**
   * Specifies an ARIA label for the typeahead search input
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the input includes a visible label, use `ariaLabelledBy` instead.
   */
  @Input()
  public ariaLabel: string;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the typeahead search input. This sets the input's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the input does not include a visible label, use `ariaLabel` instead.
   */
  @Input()
  public ariaLabelledBy: string;

  /**
   * Specifies the value for the `autocomplete` attribute on the form input.
   * @default "off"
   */
  @Input()
  public autocompleteAttribute: string;

  /**
   * Specifies a data source for the lookup component to search when users
   * enter text. You can specify static data such as an array of objects, or
   * you can pull data from a database.
   * @default []
   */
  @Input()
  public set data(value: any[]) {
    this._data = value;

    if (this.openNativePicker) {
      this.openNativePicker.componentInstance.updateItemData(value);
    }
  }

  public get data(): any[] {
    return this._data;
  }

  /**
   * Indicates whether to disable the lookup field.
   */
  @Input()
  public disabled = false;

  /**
   * Indicates whether to enable users to open a picker where they can view all options.
   */
  @Input()
  public enableShowMore: boolean = false;

  /**
   * Specifies placeholder text to display in the lookup field.
   */
  @Input()
  public placeholderText: string;

  /**
   * Specifies an object property that represents the object's unique identifier.
   * Specifying this property enables token animations and more efficient rendering.
   */
  @Input()
  public idProperty: string;

  /**
   * Indicates whether to display a button that lets users add options to the list.
   */
  @Input()
  public showAddButton: boolean = false;
  /**
   * Specifies configuration options for the picker that displays all options.
   */
  @Input()
  public showMoreConfig: SkyLookupShowMoreConfig;

  /**
   * Specifies whether users can select one option or multiple options.
   * @default "mulitple"
   */
  @Input()
  public set selectMode(value: SkyLookupSelectMode) {
    let multipleToSingle: boolean = value === SkyLookupSelectMode.single && this.selectMode === SkyLookupSelectMode.multiple;

    this._selectMode = value;
    this.updateForSelectMode();

    if (multipleToSingle) {
      if (this.value && this.value.length > 1) {
        // The `setTimeout` is needed to avoid a `ExpressionChangedAfterItHasBeenCheckedError` error in template forms.
        setTimeout(() => {
          this.writeValue([this.value[0]]);
          this.changeDetector.detectChanges();
        });
      }
    }
  }

  public get selectMode(): SkyLookupSelectMode {
    return this._selectMode || SkyLookupSelectMode.multiple;
  }

  /**
   * Fires when users select the button to add options to the list.
   */
  @Output()
  public addClick: EventEmitter<SkyLookupAddClickEventArgs> = new EventEmitter();

  public get tokens(): SkyToken[] {
    return this._tokens;
  }

  public set tokens(value: SkyToken[]) {
    // Collapse the tokens into a single token if the user has selected many options.
    if (this.enableShowMore && this.value.length > 5) {
      this.resourcesService.getString(
        'skyux_lookup_tokens_summary',
        this.value.length.toString()
      )
        .pipe(take(1))
        .subscribe((label) => {
          this._tokens = [{
            value: { [this.descriptorProperty]: label }
          }];
          this.changeDetector.markForCheck();
        });
    } else {
      this._tokens = value;
      this.changeDetector.markForCheck();
    }
  }

  public get value(): any[] {
    return this._value ? this._value : [];
  }

  public set value(newValue: any[]) {
    this._value = newValue;

    if (!this.openNativePicker) {
      this.tokens = this.parseTokens(newValue);
    }

    this.onChange(this._value);
    this.onTouched();
  }

  public autocompleteController = new Subject<SkyAutocompleteMessage>();
  public isInputFocused = false;
  public tokensController = new Subject<SkyTokensMessage>();

  @ViewChild(SkyAutocompleteInputDirective, {
    read: SkyAutocompleteInputDirective,
    static: false
  })
  private set autocompleteInputDirective(value: SkyAutocompleteInputDirective) {
    this._autocompleteInputDirective = value;
    this.updateForSelectMode();
  }

  private get autocompleteInputDirective(): SkyAutocompleteInputDirective {
    return this._autocompleteInputDirective;
  }

  @ViewChild('showMoreButtonTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private showMoreButtonTemplateRef: TemplateRef<any>;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private inputTemplateRef: TemplateRef<any>;

  @ViewChild('lookupWrapper', {
    read: ElementRef
  })
  private lookupWrapperRef: ElementRef;

  @ViewChild('searchIconTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private searchIconTemplateRef: TemplateRef<any>;

  private ngUnsubscribe = new Subject();
  private idle = new Subject();
  private markForTokenFocusOnKeyUp = false;
  private openNativePicker: SkyModalInstance;

  private _autocompleteInputDirective: SkyAutocompleteInputDirective;
  private _data: any[];
  private _selectMode: SkyLookupSelectMode;
  private _tokens: SkyToken[];
  private _value: any[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private windowRef: SkyAppWindowRef,
    @Self() @Optional() ngControl: NgControl,
    private adapter: SkyLookupAdapterService,
    private modalService: SkyModalService,
    private resourcesService: SkyLibResourcesService,
    @Optional() public inputBoxHostSvc?: SkyInputBoxHostService,
    @Optional() public themeSvc?: SkyThemeService
  ) {
    super();
    ngControl.valueAccessor = this;
  }

  public ngOnInit(): void {
    if (this.inputBoxHostSvc) {
      this.inputBoxHostSvc.populate(
        {
          inputTemplate: this.inputTemplateRef,
          buttonsTemplate: this.enableShowMore ? this.showMoreButtonTemplateRef : undefined,
          iconsInsetTemplate: this.enableShowMore ? undefined : this.searchIconTemplateRef
        }
      );
    }

    /* istanbul ignore else */
    if (this.themeSvc) {
      // This is required for the autocomplete directive to be set after elements
      // are rearranged when switching themes.
      this.themeSvc?.settingsChange
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => {
          this.changeDetector.markForCheck();
        });
    }
  }

  public ngAfterViewInit(): void {
    if (!this.disabled) {
      this.addEventListeners();
    }
  }

  public ngOnDestroy(): void {
    this.removeEventListeners();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.tokensController.complete();
  }

  public addButtonClicked(): void {
    this.addClick.emit({ itemAdded: (args: SkyLookupAddCallbackArgs) => this.onAddButtonComplete(args) });
  }

  public onAutocompleteSelectionChange(change: SkyAutocompleteSelectionChange): void {
    /* istanbul ignore else */
    if (change.selectedItem) {
      this.addToSelected(change.selectedItem);
    } else if (this.selectMode === SkyLookupSelectMode.single) {
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
        this.focusInput();
      }

      // NOTE: We do this here instead of just using the `value` setter because we need to use the
      // set of tokens returned here for the purposes of setting focus (see `onTokensKeyUp`).
      this._value = change.map(token => { return token.value; });
      this.tokens = change;

      this.onChange(this._value);
      this.onTouched();
    }
  }

  public onTokensFocusIndexOverRange(): void {
    this.windowRef.nativeWindow.setTimeout(() => {
      this.focusInput();
    });
  }

  public onTokensKeyUp(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (this.selectMode !== 'single') {
      /* tslint:disable-next-line:switch-default */
      switch (event.key) {
        case 'Backspace':
          this.sendTokensMessage(SkyTokensMessageType.RemoveActiveToken);
          this.sendTokensMessage(SkyTokensMessageType.FocusPreviousToken);
          event.preventDefault();
          break;

        case 'Del':
        case 'Delete':
          this.sendTokensMessage(SkyTokensMessageType.RemoveActiveToken);
          this.windowRef.nativeWindow.setTimeout(() => {
            this.sendTokensMessage(SkyTokensMessageType.FocusActiveToken);
          });
          event.preventDefault();
          break;
      }
    }
  }

  public writeValue(value: any[]): void {
    if (!this.disabled) {
      this.value = value ? value : [];
      this.updateForSelectMode();
    }
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange = (value: any[]) => { };
  /* istanbul ignore next */
  public onTouched = () => { };

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  public setDisabledState(disabled: boolean): void {
    this.removeEventListeners();

    if (!disabled) {
      this.addEventListeners();
    }

    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  public clearSearchText(): void {
    this.autocompleteInputDirective.value = undefined;
    this.autocompleteInputDirective.inputTextValue = undefined;
  }

  // Handles when to focus on the tokens.
  // Check for empty search text on keydown, before the escape key is fully pressed.
  // (Otherwise, a single character being escaped would register as empty on keyup.)
  // If empty on keydown, set a flag so that the appropriate action can be taken on keyup.
  public inputKeydown(event: KeyboardEvent, value: string): void {
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
            this.markForTokenFocusOnKeyUp = false;
          } else {
            this.markForTokenFocusOnKeyUp = true;
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
          if (this.markForTokenFocusOnKeyUp) {
            this.sendTokensMessage(SkyTokensMessageType.FocusLastToken);
            event.preventDefault();
          }
          break;
        default:
      }

      event.stopPropagation();
    }
  }

  public onSearchButtonClick(): void {
    this.sendAutocompleteMessage(SkyAutocompleteMessageType.CloseDropdown);

    let isValueInTextBox = false;
    if (this.selectMode === SkyLookupSelectMode.single) {
      isValueInTextBox = this.autocompleteInputDirective.inputTextValue === this.autocompleteInputDirective.value[this.descriptorProperty];
    }

    this.openPicker(isValueInTextBox ? '' : this.autocompleteInputDirective.inputTextValue);
    this.autocompleteInputDirective.restoreInputTextValueToPreviousState();
  }

  public onShowMoreClick(event: SkyAutocompleteShowMoreArgs): void {
    this.openPicker(event?.inputValue);
  }

  public openPicker(initialSearch: string): void {
    if (this.showMoreConfig?.customPicker) {
      this.showMoreConfig.customPicker.open({
        items: this.data,
        initialSearch: initialSearch,
        initialValue: this.value
      });
    } else {
      let initialValue = this.value;
      const modalConfig = this.showMoreConfig?.nativePickerConfig || {};
      if (!modalConfig.itemTemplate) {
        modalConfig.itemTemplate = this.searchResultTemplate;
      }

      let context: SkyLookupShowMoreNativePickerContext = {
        items: this.data,
        descriptorProperty: this.descriptorProperty,
        initialSearch: initialSearch,
        initialValue: initialValue,
        search: this.search,
        selectMode: this.selectMode,
        showAddButton: this.showAddButton,
        userConfig: modalConfig
      };

      this.openNativePicker = this.modalService.open(SkyLookupShowMoreModalComponent, {
        providers: [
          {
            provide: SkyLookupShowMoreNativePickerContext, useValue: context
          }
        ]
      });

      this.openNativePicker.componentInstance.addClick.subscribe(() => {
        this.addButtonClicked();
      });

      this.openNativePicker.closed.subscribe(closeArgs => {
        this.openNativePicker = undefined;
        if (closeArgs.reason === 'save') {
          let selectedItems: any[] = [];

          this.data.forEach((item: any, dataIndex: number) => {
            if (closeArgs.data.some((savedItem: any) => {
              return savedItem.index === dataIndex;
            })) {
              selectedItems.push(item);
            }
          });

          this.writeValue(selectedItems);
        } else {
          this.writeValue(initialValue);
        }

        this.focusInput();
        this.changeDetector.markForCheck();
      });
    }
  }

  private addToSelected(item: any): void {
    let selectedItems: any[];

    if (this.selectMode === 'single') {
      selectedItems = [item];
    } else {
      selectedItems = this.value;

      // If items have a unique identifier, don't allow the same item to be added twice.
      if (
        !this.idProperty ||
        !this.value.some(
          existingItem => existingItem[this.idProperty] === item[this.idProperty]
        )
      ) {
        selectedItems.push(item);
      }

      this.clearSearchText();
    }

    this.writeValue(selectedItems);
  }

  private addEventListeners(): void {
    this.idle = new Subject();
    this.focusInputOnHostClick();
  }

  private removeEventListeners(): void {
    this.idle.next();
    this.idle.complete();
  }

  private focusInputOnHostClick(): void {
    let hostElement = !this.inputBoxHostSvc ? this.elementRef.nativeElement : this.lookupWrapperRef.nativeElement;
    const documentObj = this.windowRef.nativeWindow.document;

    // Handles focusing the input when the host is clicked.
    // The input should NOT be focused if other elements (tokens, etc.)
    // are currently focused or being tabbed through.

    observableFromEvent(documentObj, 'mousedown')
      .pipe(takeUntil(this.idle))
      .subscribe((event: MouseEvent) => {
        hostElement = !this.inputBoxHostSvc ? this.elementRef.nativeElement : this.lookupWrapperRef.nativeElement;
        this.isInputFocused = hostElement.contains(event.target);

        this.changeDetector.markForCheck();
      });

    observableFromEvent(documentObj, 'focusin')
      .pipe(takeUntil(this.idle))
      .subscribe((event: KeyboardEvent) => {
        hostElement = !this.inputBoxHostSvc ? this.elementRef.nativeElement : this.lookupWrapperRef.nativeElement;
        this.isInputFocused = hostElement.contains(event.target);

        this.changeDetector.markForCheck();
      });

    observableFromEvent(hostElement, 'mouseup')
      .pipe(takeUntil(this.idle))
      .subscribe(() => {
        const classList = documentObj.activeElement.classList;
        if (!classList || !classList.contains('sky-token')) {
          this.focusInput();
        }
      });
  }

  private focusInput(): void {
    this.adapter.focusInput(this.lookupWrapperRef);
  }

  private onAddButtonComplete(args: SkyLookupAddCallbackArgs) {
    if (args.data) {
      this.data = args.data;
    }

    if (this.data.indexOf(args.item) >= 0) {
      if (this.openNativePicker) {
        (<SkyLookupShowMoreModalComponent>this.openNativePicker.componentInstance)
          .onItemSelect(true, { value: args.item, selected: false });
      } else {
        let newValue = this.value;
        if (this.selectMode === SkyLookupSelectMode.multiple) {
          newValue = this.value.concat(args.item);
        } else {
          newValue = [args.item];
        }
        this.writeValue(newValue);
      }
    }
  }

  private parseTokens(data: any[]): SkyToken[] {
    return data.map((item: any) => {
      return {
        value: item
      };
    });
  }

  private sendAutocompleteMessage(type: SkyAutocompleteMessageType): void {
    this.autocompleteController.next({ type });
  }

  private sendTokensMessage(type: SkyTokensMessageType): void {
    this.tokensController.next({ type });
  }

  private updateForSelectMode(): void {
    if (this.autocompleteInputDirective) {
      if (this.selectMode === 'single') {
        this.autocompleteInputDirective.value = this.value &&
          this.value[0];
      } else {
        this.clearSearchText();
      }
    }
  }
}
