import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyToken
} from './types/token';

import {
  SkyTokensMessage
} from './types/tokens-message';

import {
  SkyTokensMessageType
} from './types/tokens-message-type';

import {
  SkyTokenSelectedEventArgs
} from './types/token-selected-event-args';

import {
  SkyTokenComponent
} from './token.component';

@Component({
  selector: 'sky-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTokensComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Indicates whether to disable the tokens list to prevent users from selecting tokens,
   * dismissing tokens, or navigating through the list with the arrow keys. When the tokens list
   * is disabled, users can still place focus on items in the list using the `Tab` key.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return !!this._disabled;
  }

  /**
   * Indicates whether users can remove tokens from the list by selecting their close buttons
   * or pressing the `Backspace` key.
   * @default true
   */
  @Input()
  public set dismissible(value: boolean) {
    this._dismissible = value;
  }

  public get dismissible(): boolean {
    return (this._dismissible !== false);
  }

  /**
   * Specifies the token property to display for each item in the tokens list.
   * @default 'name'
   */
  @Input()
  public set displayWith(value: string) {
    this._displayWith = value;
  }

  public get displayWith(): string {
    return this._displayWith || 'name';
  }

  /**
   * Indicates whether users can focus on items in the list using the `Tab` key.
   * This does not affect the ability of users to select tokens, dismiss tokens,
   * or navigate through the list with the arrow keys.
   * @default true
   */
  @Input()
  public set focusable(value: boolean) {
    this._focusable = value;
  }

  public get focusable(): boolean {
    return (this._focusable !== false);
  }

  /**
   * Specifies an array of tokens to include in the list.
   */
  @Input()
  public set tokens(value: SkyToken[]) {
    this._tokens = value;
    this.tokensChange.emit(this._tokens);
  }

  public get tokens(): SkyToken[] {
    return this._tokens || [];
  }

  /**
   * Specifies an observable of `SkyTokensMessage` that can place focus on a
   * particular token or remove the active token from the list.
   */
  @Input()
  public messageStream = new Subject<SkyTokensMessage>();

  /**
   * Fires when users navigate through the tokens list with the `Tab` key
   * and attempt to move past the final token in the list.
   */
  @Output()
  public focusIndexOverRange = new EventEmitter<void>();

  /**
   * Fires when usersnavigate through the tokens list with the `Tab` key
   * and attempt to move before the first token in the list.
   */
  @Output()
  public focusIndexUnderRange = new EventEmitter<void>();

  /**
   * Fires when users select a token in the list. This event emits the selected token.
   */
  @Output()
  public tokenSelected = new EventEmitter<SkyTokenSelectedEventArgs>();

  /**
   * Fires when the tokens in the list change.
   * This event emits an array of the tokens in the updated list.
   */
  @Output()
  public tokensChange = new EventEmitter<SkyToken[]>();

  /**
   * @internal
   */
  public get activeIndex(): number {
    return this._activeIndex || 0;
  }
  public set activeIndex(value: number) {
    if (value >= this.tokens.length) {
      value = this.tokens.length - 1;
      this.focusIndexOverRange.emit();
    }

    if (value < 0) {
      value = 0;
      this.focusIndexUnderRange.emit();
    }

    this._activeIndex = value;
  }

  @ViewChildren(SkyTokenComponent)
  private tokenComponents: QueryList<SkyTokenComponent>;

  private ngUnsubscribe = new Subject();

  private _activeIndex: number;
  private _disabled: boolean;
  private _dismissible: boolean;
  private _focusable: boolean;
  private _tokens: SkyToken[];
  private _displayWith: string;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    if (this.messageStream) {
      this.initMessageStream();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.messageStream &&
      changes.messageStream.currentValue &&
      !changes.messageStream.firstChange
    ) {
      this.initMessageStream();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (this.messageStream) {
      this.messageStream.complete();
    }
  }

  public onTokenClick(token: SkyToken): void {
    if (this.disabled) {
      return;
    }

    this.notifyTokenSelected(token);
  }

  public onTokenKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      const key = event.key.toLowerCase();
      if (this.disabled) {
        return;
      }

      /* tslint:disable-next-line:switch-default */
      switch (key) {
        case 'left':
        case 'arrowleft':
        this.messageStream.next({ type: SkyTokensMessageType.FocusPreviousToken });
        event.preventDefault();
        break;

        case 'right':
        case 'arrowright':
        this.messageStream.next({ type: SkyTokensMessageType.FocusNextToken });
        event.preventDefault();
        break;
      }
    }
  }

  public selectToken(token: SkyToken): void {
    if (this.disabled) {
      return;
    }

    this.notifyTokenSelected(token);
  }

  public removeToken(token: SkyToken): void {
    this.tokens = this.tokens.filter(t => t !== token);
    this.changeDetector.detectChanges();
  }

  private focusPreviousToken(): void {
    this.activeIndex--;
    this.focusActiveToken();
  }

  private focusNextToken(): void {
    this.activeIndex++;
    this.focusActiveToken();
  }

  private focusLastToken(): void {
    this.activeIndex = this.tokenComponents.length - 1;
    this.focusActiveToken();
  }

  private focusActiveToken(): void {
    const tokenComponent = this.tokenComponents
      .find((comp: SkyTokenComponent, i: number) => {
        return (this.activeIndex === i);
      });

    if (tokenComponent) {
      tokenComponent.focusElement();
    }
  }

  private removeActiveToken(): void {
    const token = this.tokens[this.activeIndex];
    if (token) {
      this.removeToken(token);
    }
  }

  private initMessageStream(): void {
    this.messageStream
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((message: SkyTokensMessage) => {
        /* tslint:disable-next-line:switch-default */
        switch (message.type) {
          case SkyTokensMessageType.FocusLastToken:
          this.focusLastToken();
          break;

          case SkyTokensMessageType.FocusActiveToken:
          this.focusActiveToken();
          break;

          case SkyTokensMessageType.FocusPreviousToken:
          this.focusPreviousToken();
          break;

          case SkyTokensMessageType.FocusNextToken:
          this.focusNextToken();
          break;

          case SkyTokensMessageType.RemoveActiveToken:
          this.removeActiveToken();
          break;
        }
      });
  }

  private notifyTokenSelected(token: SkyToken): void {
    this.tokenSelected.emit({
      token
    });
  }
}
