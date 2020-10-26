import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
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
  takeUntil
} from 'rxjs/operators';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyInputBoxHostService
} from '@skyux/forms';

import {
  SkyToken,
  SkyTokensMessage,
  SkyTokensMessageType
} from '@skyux/indicators';

import {
  SkyAutocompleteSelectionChange
} from '../autocomplete/types/autocomplete-selection-change';

import {
  SkyAutocompleteInputDirective
} from '../autocomplete/autocomplete-input.directive';

import {
  SkyLookupAutocompleteAdapter
} from './lookup-autocomplete-adapter';

import {
  SkyLookupAdapterService
} from './lookup-adapter.service';

@Component({
  selector: 'sky-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  providers: [SkyLookupAdapterService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyLookupComponent
  extends SkyLookupAutocompleteAdapter
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

/**
 * Defines a string value to label the typeahead search input for accessibility.
 * If a label is visible on the screen, use the `ariaLabelledBy` property instead.
 */
  @Input()
  public ariaLabel: string;

/**
 * Identifies the element that defines a label for the typeahead search input.
 * If a label is not visible on the screen, use the `ariaLabel` property instead.
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
 * Indicates whether to disable the lookup field.
 */
  @Input()
  public disabled = false;

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

  public get tokens(): SkyToken[] {
    return this._tokens;
  }

  public set tokens(value: SkyToken[]) {
    this._tokens = value;
    this.onChange(this.value);
    this.onTouched();
  }

  public get value(): any[] {
    if (!this.tokens) {
      return [];
    }

    return this.tokens.map(token => token.value);
  }

  public isInputFocused = false;
  public tokensController = new Subject<SkyTokensMessage>();

  @ViewChild(SkyAutocompleteInputDirective, {
    read: SkyAutocompleteInputDirective,
    static: false
  })
  private autocompleteInputDirective: SkyAutocompleteInputDirective;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private inputTemplateRef: TemplateRef<any>;

  private ngUnsubscribe = new Subject();
  private idle = new Subject();
  private markForTokenFocusOnKeyUp = false;

  private _tokens: SkyToken[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private windowRef: SkyAppWindowRef,
    @Self() @Optional() ngControl: NgControl,
    private adapter: SkyLookupAdapterService,
    @Optional() public inputBoxHostSvc?: SkyInputBoxHostService
  ) {
    super();
    ngControl.valueAccessor = this;
  }

  public ngOnInit(): void {
    if (this.inputBoxHostSvc) {
      this.inputBoxHostSvc.populate(
        {
          inputTemplate: this.inputTemplateRef
        }
      );
    }
  }

  public ngAfterViewInit() {
    if (!this.disabled) {
      this.addEventListeners();
    }
  }

  public ngOnDestroy() {
    this.removeEventListeners();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.tokensController.complete();
  }

  public onAutocompleteSelectionChange(change: SkyAutocompleteSelectionChange) {
    /* istanbul ignore else */
    if (change.selectedItem) {
      this.addToSelected(change.selectedItem);
      this.focusInput();
    }
  }

  public onAutocompleteBlur(): void {
    this.onTouched();
  }

  public onTokensChange(change: SkyToken[]) {
    if (!change) {
      return;
    }

    if (change.length === 0) {
      this.focusInput();
    }

    if (this.tokens !== change) {
      this.tokens = change;
    }
  }

  public onTokensFocusIndexOverRange() {
    this.windowRef.nativeWindow.setTimeout(() => {
      this.focusInput();
    });
  }

  public onTokensKeyUp(event: KeyboardEvent) {
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

  public writeValue(value: any[]) {
    if (value && !this.disabled) {
      const copy = this.cloneItems(value);
      this.tokens = this.parseTokens(copy);
    }
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange = (value: any[]) => {};
  /* istanbul ignore next */
  public onTouched = () => {};

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  public setDisabledState(disabled: boolean) {
    this.removeEventListeners();

    if (!disabled) {
      this.addEventListeners();
    }

    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  public clearSearchText() {
    this.autocompleteInputDirective.value = undefined;
    this.autocompleteInputDirective.inputTextValue = undefined;
  }

  // Handles when to focus on the tokens.
  // Check for empty search text on keydown, before the escape key is fully pressed.
  // (Otherwise, a single character being escaped would register as empty on keyup.)
  // If empty on keydown, set a flag so that the appropriate action can be taken on keyup.

  public inputKeydown(event: KeyboardEvent, value: string): void {
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

  public inputKeyup(event: KeyboardEvent): void {
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

  private addToSelected(item: any) {
    // If items have a unique identifier, don't allow the same item to be added twice.
    if (
      !this.idProperty ||
        !this.tokens?.some(
          token => token.value[this.idProperty] === item[this.idProperty]
        )
    ) {
      const selectedItems: any[] = [
        ...(this.tokens?.map(token => token.value) || []),
        item
      ];

      this.writeValue(selectedItems);
    }

    this.clearSearchText();
  }

  private addEventListeners() {
    this.idle = new Subject();
    this.focusInputOnHostClick();
  }

  private removeEventListeners() {
    this.idle.next();
    this.idle.complete();
  }

  private focusInputOnHostClick() {
    const hostElement = this.elementRef.nativeElement;
    const documentObj = this.windowRef.nativeWindow.document;

    // Handles focusing the input when the host is clicked.
    // The input should NOT be focused if other elements (tokens, etc.)
    // are currently focused or being tabbed through.

    observableFromEvent(documentObj, 'mousedown')
      .pipe(takeUntil(this.idle))
      .subscribe((event: MouseEvent) => {
        this.isInputFocused = hostElement.contains(event.target);
        this.changeDetector.markForCheck();
      });

    observableFromEvent(documentObj, 'focusin')
      .pipe(takeUntil(this.idle))
      .subscribe((event: KeyboardEvent) => {
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

  private focusInput() {
    this.adapter.focusInput(this.elementRef);
  }

  private cloneItems(items: any[]): any[] {
    return items.map(item => {
      return { ...item };
    });
  }

  private parseTokens(data: any[]): SkyToken[] {
    return data.map((item: any) => {
      return {
        value: item
      };
    });
  }

  private sendTokensMessage(type: SkyTokensMessageType) {
    this.tokensController.next({ type });
  }
}
