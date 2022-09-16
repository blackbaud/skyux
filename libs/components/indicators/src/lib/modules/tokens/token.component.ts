import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

@Component({
  selector: 'sky-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyTokenComponent {
  /**
   * Indicates whether to disable the token to prevent users from selecting it, dismissing it,
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
   * Specifies an ARIA label for the token's close button. This sets the button's `aria-label`
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * @default "Remove item"
   */
  @Input()
  public set ariaLabel(value: string | undefined) {
    this.#ariaLabelOrDefault = value || this.#getDefaultAriaLabel();
  }

  public get ariaLabel(): string {
    return this.#ariaLabelOrDefault;
  }

  /**
   * Indicates whether users can remove the token from the list by selecting the close button.
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
   * Indicates whether users can press the `Tab` key to place focus on the token. This does not
   * affect the ability to select the token, dismiss it, or navigate to it with the arrow keys.
   * @default true
   */
  @Input()
  public set focusable(value: boolean | undefined) {
    this.tabIndex = value !== false ? 0 : -1;
  }

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

  public tokenActive = false;
  public closeActive = false;
  public tabIndex = 0;

  #ariaLabelOrDefault: string;
  #elementRef: ElementRef;
  #resourcesSvc: SkyLibResourcesService;

  #_disabled = false;
  #_dismissible = true;

  constructor(elementRef: ElementRef, resourcesSvc: SkyLibResourcesService) {
    this.#elementRef = elementRef;
    this.#resourcesSvc = resourcesSvc;

    this.#ariaLabelOrDefault = this.#getDefaultAriaLabel();
  }

  public dismissToken(event: Event): void {
    event.stopPropagation();
    this.dismiss.emit();
  }

  public focusElement(): void {
    this.#elementRef.nativeElement.querySelector('.sky-token').focus();
  }

  public setTokenActive(tokenActive: boolean): void {
    this.tokenActive = tokenActive;
  }

  public setCloseActive(closeActive: boolean): void {
    this.closeActive = closeActive;
  }

  #getDefaultAriaLabel(): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.#resourcesSvc.getStringForLocale(
      { locale: 'en-US' },
      'skyux_tokens_dismiss_button_title'
    );
  }
}
