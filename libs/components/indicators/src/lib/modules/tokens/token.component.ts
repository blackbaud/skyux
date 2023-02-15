import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'sky-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyTokenComponent {
  /**
   * Whether to disable the token to prevent users from selecting it, dismissing it,
   * or navigating to it with the arrow keys. When the token is disabled,
   * users can still place focus on it using the `Tab` key.
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
   * The ARIA label for the token's close button. This sets the button's `aria-label` to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @default "Remove item"
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Whether users can remove the token from the list by selecting the close button.
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
   * Whether users can place focus on the token using the `Tab`. This does not
   * affect the ability to select the token, dismiss it, or navigate to it with the arrow keys.
   * @default true
   */
  @Input()
  public set focusable(value: boolean | undefined) {
    this.tabIndex = value !== false ? 0 : -1;
  }

  /**
   * Used by the tokens component to set the appropriate role for each token.
   * @internal
   */
  @Input()
  public role: string | undefined;

  /**
   * Fires when users click the close button.
   */
  @Output()
  public dismiss = new EventEmitter<void>();

  /**
   * Fires when users place focus on the token by navigating to it with the `Tab` key.
   */
  @Output()
  public tokenFocus = new EventEmitter<void>();

  @ViewChild('actionButton', { read: ElementRef, static: true })
  public actionButtonRef: ElementRef | undefined;

  public isFocused = false;
  public tokenActive = false;
  public closeActive = false;
  public tabIndex = 0;

  #elementRef: ElementRef;

  #_disabled = false;
  #_dismissible = true;

  constructor(elementRef: ElementRef) {
    this.#elementRef = elementRef;
  }

  protected onFocusIn(): void {
    if (!this.isFocused) {
      this.tokenFocus.emit();
      this.isFocused = true;
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    this.isFocused = this.#elementRef.nativeElement.contains(
      event.relatedTarget
    );
  }

  public dismissToken(event: Event): void {
    event.stopPropagation();
    this.dismiss.emit();
  }

  public focusElement(): void {
    this.actionButtonRef?.nativeElement.focus();
  }

  public setTokenActive(tokenActive: boolean): void {
    this.tokenActive = tokenActive;
  }

  public setCloseActive(closeActive: boolean): void {
    this.closeActive = closeActive;
  }
}
