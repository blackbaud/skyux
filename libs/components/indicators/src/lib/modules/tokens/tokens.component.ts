import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTokenComponent } from './token.component';
import { SkyToken } from './types/token';
import { SkyTokenSelectedEventArgs } from './types/token-selected-event-args';
import { SkyTokensMessage } from './types/tokens-message';
import { SkyTokensMessageType } from './types/tokens-message-type';

@Component({
  selector: 'sky-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('blockAnimationOnLoad', [transition(':enter', [])]),
    trigger('dismiss', [
      transition(':enter', [
        style({
          opacity: 0,
          width: 0,
        }),
        animate(
          '150ms ease-in',
          style({
            opacity: 1,
            width: '*',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({
            opacity: 0,
            width: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SkyTokensComponent implements OnDestroy {
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
    return this._dismissible !== false;
  }

  /**
   * Specifies the token property to display for each item in the tokens list.
   * @default "name"
   */
  @Input()
  public set displayWith(value: string) {
    this._displayWith = value;
  }

  public get displayWith(): string {
    return this._displayWith || 'name';
  }

  /**
   * Specifies the token property that represents the token's unique identifier. When this property
   * is set, animations are enabled when dismissing tokens.
   */
  @Input()
  public trackWith: string;

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
    return this._focusable !== false;
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
  public set messageStream(value: Subject<SkyTokensMessage>) {
    this._messageStream = value;
    this.initMessageStream();
  }

  public get messageStream(): Subject<SkyTokensMessage> {
    return this._messageStream;
  }

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

  /**
   * internal
   */
  public trackTokenFn: (index: number, item: SkyToken) => any;

  @ViewChildren(SkyTokenComponent)
  private tokenComponents: QueryList<SkyTokenComponent>;

  private messageStreamSub: Subscription;
  private ngUnsubscribe = new Subject();

  private _activeIndex: number;
  private _disabled: boolean;
  private _dismissible: boolean;
  private _focusable: boolean;
  private _tokens: SkyToken[];
  private _displayWith: string;
  private _messageStream: Subject<SkyTokensMessage>;

  constructor(private changeDetector: ChangeDetectorRef) {
    // Angular calls the trackBy function without applying the component instance's scope.
    // Use a fat-arrow function so the current component instance's trackWith property can
    // be referenced.
    this.trackTokenFn = (_index, item) => {
      if (this.trackWith) {
        return item.value[this.trackWith];
      }

      return item;
    };
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onTokenClick(token: SkyToken): void {
    if (this.disabled) {
      return;
    }

    this.notifyTokenSelected(token);
  }

  public onTokenKeyDown(event: KeyboardEvent): void {
    if (!this.disabled) {
      switch (event.key) {
        case 'Left':
        case 'ArrowLeft':
          this.messageStream.next({
            type: SkyTokensMessageType.FocusPreviousToken,
          });
          event.preventDefault();
          break;

        case 'Right':
        case 'ArrowRight':
          this.messageStream.next({
            type: SkyTokensMessageType.FocusNextToken,
          });
          event.preventDefault();
          break;
      }
    }
  }

  public selectToken(token: SkyToken): void {
    if (!this.disabled) {
      this.notifyTokenSelected(token);
    }
  }

  public removeToken(token: SkyToken): void {
    this.tokens = this.tokens.filter((t) => t !== token);
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
    const tokenComponent = this.tokenComponents.find(
      (_comp: SkyTokenComponent, i: number) => {
        return this.activeIndex === i;
      }
    );

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
    if (this.messageStreamSub) {
      this.messageStreamSub.unsubscribe();
    }

    if (this.messageStream) {
      this.messageStreamSub = this.messageStream
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((message: SkyTokensMessage) => {
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
  }

  private notifyTokenSelected(token: SkyToken): void {
    this.tokenSelected.emit({
      token,
    });
  }
}
