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
   * @default true
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return !!this._disabled;
  }

  /**
   * Specifies an ARIA label for the token's close button. This sets the button's `aria-label`
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * @default "Remove item"
   */
  @Input()
  public set ariaLabel(value: string) {
    this._ariaLabel = value;
  }

  public get ariaLabel(): string {
    return (
      this._ariaLabel || this.getString('skyux_tokens_dismiss_button_title')
    );
  }

  /**
   * Indicates whether users can remove the token from the list by selecting the close button
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
   * Indicates whether users can press the `Tab` key to place focus on the token. This does not
   * affect the ability to select the token, dismiss it, or navigate to it with the arrow keys.
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
   * Fires when users click the close button or press the `Backspace` key to dismiss the token.
   */
  @Output()
  public dismiss = new EventEmitter<void>();

  /**
   * Fires when users place focus on the token by navigating to it with the `Tab` key.
   */
  @Output()
  public tokenFocus = new EventEmitter<void>();

  /**
   * @internal
   */
  public get tabIndex(): number | boolean {
    return this.focusable ? 0 : -1;
  }

  /**
   * @internal
   */
  public tokenActive: boolean;

  /**
   * @internal
   */
  public closeActive: boolean;

  private _ariaLabel: string;
  private _disabled: boolean;
  private _dismissible: boolean;
  private _focusable: boolean;

  constructor(
    private elementRef: ElementRef,
    private resourcesService: SkyLibResourcesService
  ) {}

  public dismissToken(event: Event): void {
    event.stopPropagation();
    this.dismiss.emit();
  }

  public focusElement(): void {
    this.elementRef.nativeElement.querySelector('.sky-token').focus();
  }

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale({ locale: 'en-US' }, key);
  }
}
