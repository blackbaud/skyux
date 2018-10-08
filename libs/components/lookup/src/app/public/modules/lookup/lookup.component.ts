import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

import {
  SkyAutocompleteSelectionChange,
  SkyAutocompleteInputDirective
} from '../autocomplete';

import {
  SkyToken,
  SkyTokensMessage,
  SkyTokensMessageType
} from '@skyux/indicators';

import {
  SkyWindowRefService
} from '@skyux/core';

import { SkyLookupAutocompleteAdapter } from './lookup-autocomplete-adapter';

@Component({
  selector: 'sky-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    /* tslint:disable-next-line:no-forward-ref */
    useExisting: forwardRef(() => SkyLookupComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyLookupComponent
  extends SkyLookupAutocompleteAdapter
  implements AfterContentInit, OnDestroy, ControlValueAccessor {

  @Input()
  public ariaLabel: string;

  @Input()
  public ariaLabelledBy: string;

  @Input()
  public disabled = false;

  @Input()
  public placeholderText: string;

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

  @ViewChild(SkyAutocompleteInputDirective)
  private autocompleteInputDirective: SkyAutocompleteInputDirective;

  @ViewChild('lookupInput')
  private lookupInput: ElementRef;

  private ngUnsubscribe = new Subject();
  private idle = new Subject();
  private markForTokenFocusOnKeyUp = false;

  private _tokens: SkyToken[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private windowRef: SkyWindowRefService
  ) {
    super();
  }

  public ngAfterContentInit() {
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
    this.addToSelected(change.selectedItem);
    this.focusInput();
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
    this.windowRef.getWindow().setTimeout(() => {
      this.focusInput();
    });
  }

  public onTokensKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'backspace') {
      this.sendTokensMessage(SkyTokensMessageType.RemoveActiveToken);
      this.sendTokensMessage(SkyTokensMessageType.FocusPreviousToken);
      event.preventDefault();
    }

    if (key === 'delete') {
      this.sendTokensMessage(SkyTokensMessageType.RemoveActiveToken);
      this.windowRef.getWindow().setTimeout(() => {
        this.sendTokensMessage(SkyTokensMessageType.FocusActiveToken);
      });
      event.preventDefault();
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
  }

  private addToSelected(item: any) {
    let selectedItems: any[] = [];

    if (this.tokens) {
      selectedItems = this.tokens.map(token => token.value);
    }

    // Add the new item.
    selectedItems = selectedItems.concat(item);

    this.writeValue(selectedItems);
    this.clearSearchText();
  }

  private addEventListeners() {
    this.idle = new Subject();
    this.focusTokensOnInputKeyUp();
    this.focusInputOnHostClick();
  }

  private removeEventListeners() {
    this.idle.next();
    this.idle.complete();
  }

  private focusTokensOnInputKeyUp() {
    const inputElement = this.lookupInput.nativeElement;

    // Handles when to focus on the tokens.
    // Check for empty search text on keydown, before the escape key is fully pressed.
    // (Otherwise, a single character being escaped would register as empty on keyup.)
    // If empty on keydown, set a flag so that the appropriate action can be taken on keyup.

    Observable
      .fromEvent(inputElement, 'keydown')
      .takeUntil(this.idle)
      .subscribe((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        if (
          key === 'left' ||
          key === 'arrowleft' ||
          key === 'backspace'
        ) {
          const isSearchEmpty = (!this.lookupInput.nativeElement.value);
          if (isSearchEmpty) {
            this.markForTokenFocusOnKeyUp = true;
          } else {
            this.markForTokenFocusOnKeyUp = false;
          }
        }
      });

    Observable
      .fromEvent(inputElement, 'keyup')
      .takeUntil(this.idle)
      .subscribe((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        if (
          key === 'left' ||
          key === 'arrowleft' ||
          key === 'backspace'
        ) {
          /* istanbul ignore else */
          if (this.markForTokenFocusOnKeyUp) {
            this.sendTokensMessage(SkyTokensMessageType.FocusLastToken);
            event.preventDefault();
          }
        }

        event.stopPropagation();
      });
  }

  private focusInputOnHostClick() {
    const hostElement = this.elementRef.nativeElement;
    const documentObj = this.windowRef.getWindow().document;

    // Handles focusing the input when the host is clicked.
    // The input should NOT be focused if other elements (tokens, etc.)
    // are currently focused or being tabbed through.

    Observable
      .fromEvent(documentObj, 'mousedown')
      .takeUntil(this.idle)
      .subscribe((event: MouseEvent) => {
        this.isInputFocused = hostElement.contains(event.target);
      });

    Observable
      .fromEvent(documentObj, 'focusin')
      .takeUntil(this.idle)
      .subscribe((event: KeyboardEvent) => {
        this.isInputFocused = hostElement.contains(event.target);
      });

    Observable
      .fromEvent(hostElement, 'mouseup')
      .takeUntil(this.idle)
      .subscribe(() => {
        const classList = documentObj.activeElement.classList;
        if (!classList || !classList.contains('sky-token')) {
          this.focusInput();
        }
      });
  }

  private focusInput() {
    this.lookupInput.nativeElement.focus();
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
