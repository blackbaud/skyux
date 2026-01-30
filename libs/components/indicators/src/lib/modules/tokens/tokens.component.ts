import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TrackByFunction,
  ViewChildren,
  inject,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTokenComponent } from './token.component';
import { SkyToken } from './types/token';
import { SkyTokenSelectedEventArgs } from './types/token-selected-event-args';
import { SkyTokensMessage } from './types/tokens-message';
import { SkyTokensMessageType } from './types/tokens-message-type';

const DISPLAY_WITH_DEFAULT = 'name';

/**
 * Creates a container that enables navigation between tokens using keyboard arrow keys.
 * This is useful when combined with other components where the <kbd>Tab</kbd> key is
 * reserved for other functions, such as the SKY UX Lookup component.
 */
@Component({
  selector: 'sky-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyTokensComponent implements OnDestroy {
  /**
   * Whether to disable the tokens list to prevent users from selecting tokens,
   * dismissing tokens, or navigating through the list with the arrow keys. When the tokens list
   * is disabled, users can still place focus on items in the list using the `Tab` key.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = !!value;
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Whether users can remove a token from the list by selecting a token's close button.
   * @default true
   */
  @Input()
  public set dismissible(value: boolean | undefined) {
    this.#_dismissible = value !== false;
  }

  public get dismissible(): boolean {
    return this.#_dismissible;
  }

  /**
   * The token property to display for each item in the tokens list.
   * @default "name"
   */
  @Input()
  public set displayWith(value: string | undefined) {
    this.#_displayWith = value || DISPLAY_WITH_DEFAULT;
  }

  public get displayWith(): string {
    return this.#_displayWith;
  }

  /**
   * The token property that represents the token's unique identifier. When this property
   * is set, animations are enabled when dismissing tokens.
   */
  @Input()
  public trackWith: string | undefined;

  /**
   * Whether users can place focus on tokens in the list using the `Tab` key.
   * This does not affect the ability of users to select tokens, dismiss tokens,
   * or navigate through the list with the arrow keys.
   * @default true
   */
  @Input()
  public set focusable(value: boolean | undefined) {
    this.#_focusable = value !== false;
  }

  public get focusable(): boolean {
    return this.#_focusable;
  }

  /**
   * The array of tokens to include in the list.
   */
  @Input()
  public set tokens(value: SkyToken[] | undefined) {
    this.#_tokens = value || [];
    // The previous behavior was to set `this._tokens = value`, then emit `this._tokens`,
    // which would emit `undefined` instead of a default value of `[]` returned by the
    // get accessor when set to `undefined`. Emitting `value` instead of `this.#_tokensOrDefault`
    // preserves that behavior.
    this.tokensChange.emit(value);
  }

  public get tokens(): SkyToken[] {
    return this.#_tokens;
  }

  /**
   * The observable of `SkyTokensMessage` that can place focus on a
   * particular token or remove the active token from the list.
   */
  @Input()
  public set messageStream(value: Subject<SkyTokensMessage> | undefined) {
    this.#_messageStream = value || new Subject<SkyTokensMessage>();
    this.#initMessageStream();
  }

  public get messageStream(): Subject<SkyTokensMessage> {
    return this.#_messageStream;
  }

  /**
   * Fires when users navigate through the tokens list with the `Tab` key
   * and attempt to move past the final token in the list.
   */
  @Output()
  public focusIndexOverRange = new EventEmitter<void>();

  /**
   * Fires when users navigate through the tokens list with the `Tab` key
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
   * Fires when all animations on the tokens are complete.
   * @internal
   */
  @Output()
  public tokensRendered = new EventEmitter<void>();

  public get activeIndex(): number {
    return this.#_activeIndex;
  }

  public set activeIndex(value: number) {
    if (value >= this.#_tokens.length) {
      value = this.#_tokens.length - 1;
      this.focusIndexOverRange.emit();
    }

    if (value < 0) {
      value = 0;
      this.focusIndexUnderRange.emit();
    }

    this.#_activeIndex = value || 0;
  }

  public trackTokenFn: TrackByFunction<SkyToken>;

  #_disabled = false;
  #_dismissible = true;
  #_focusable = true;
  #_tokens: SkyToken[] = [];
  #_displayWith = DISPLAY_WITH_DEFAULT;

  @ViewChildren(SkyTokenComponent)
  public tokenComponents: QueryList<SkyTokenComponent> | undefined;

  #messageStreamSub: Subscription | undefined;
  #ngUnsubscribe = new Subject<void>();

  #changeDetector = inject(ChangeDetectorRef);

  #_activeIndex = 0;
  #_messageStream = new Subject<SkyTokensMessage>();

  constructor() {
    this.#initMessageStream();

    // Angular calls the trackBy function without applying the component instance's scope.
    // Use a fat-arrow function so the current component instance's trackWith property can
    // be referenced.
    this.trackTokenFn = (_index, item): unknown => {
      if (this.trackWith) {
        return item.value[this.trackWith];
      }

      return item;
    };
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onTokenClick(token: SkyToken): void {
    if (this.disabled) {
      return;
    }

    this.#notifyTokenSelected(token);
  }

  public animationDone(): void {
    this.tokensRendered.emit();
  }

  public onTokenKeyDown(event: KeyboardEvent): void {
    if (!this.disabled) {
      switch (event.key) {
        case 'Left':
        case 'ArrowLeft':
          this.#_messageStream.next({
            type: SkyTokensMessageType.FocusPreviousToken,
          });
          event.preventDefault();
          break;

        case 'Right':
        case 'ArrowRight':
          this.#_messageStream.next({
            type: SkyTokensMessageType.FocusNextToken,
          });
          event.preventDefault();
          break;
      }
    }
  }

  public selectToken(token: SkyToken): void {
    if (!this.disabled) {
      this.#notifyTokenSelected(token);
    }
  }

  public removeToken(token: SkyToken): void {
    this.tokens = this.tokens.filter((t) => t !== token);
    this.#changeDetector.detectChanges();
  }

  #focusPreviousToken(): void {
    this.activeIndex--;
    this.#focusActiveToken();
  }

  #focusNextToken(): void {
    this.activeIndex++;
    this.#focusActiveToken();
  }

  #focusLastToken(): void {
    if (this.tokenComponents) {
      this.activeIndex = this.tokenComponents.length - 1;
      this.#focusActiveToken();
    }
  }

  #focusActiveToken(): void {
    if (this.tokenComponents) {
      const tokenComponent = this.tokenComponents.find(
        (_comp: SkyTokenComponent, i: number) => {
          return this.activeIndex === i;
        },
      );

      if (tokenComponent) {
        tokenComponent.focusElement();
      }
    }
  }

  #removeActiveToken(): void {
    const token = this.tokens[this.activeIndex];
    if (token) {
      this.removeToken(token);
    }
  }

  #initMessageStream(): void {
    if (this.#messageStreamSub) {
      this.#messageStreamSub.unsubscribe();
    }

    this.#messageStreamSub = this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyTokensMessage) => {
        switch (message.type) {
          case SkyTokensMessageType.FocusLastToken:
            this.#focusLastToken();
            break;

          case SkyTokensMessageType.FocusActiveToken:
            this.#focusActiveToken();
            break;

          case SkyTokensMessageType.FocusPreviousToken:
            this.#focusPreviousToken();
            break;

          case SkyTokensMessageType.FocusNextToken:
            this.#focusNextToken();
            break;

          case SkyTokensMessageType.RemoveActiveToken:
            this.#removeActiveToken();
            break;
        }
      });
  }

  #notifyTokenSelected(token: SkyToken): void {
    this.tokenSelected.emit({
      token,
    });
  }
}
