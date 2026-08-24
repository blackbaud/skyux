import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { take } from 'rxjs';

import { SKY_TOKENS_ROLE_CONTEXT } from './tokens-role-context';

@Component({
  selector: 'sky-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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
   * Used by the tokens component to set the appropriate role for each token
   * generated from the `tokens` input.
   * @internal
   */
  public readonly role = input<string | undefined>();

  /**
   * The role to apply to the token's host element. Tokens generated from the
   * `tokens` input receive their role directly through the `role` input above.
   * Manually projected tokens never receive that binding (Angular does not
   * apply template bindings to projected content), so they fall back to
   * asking the ancestor `sky-tokens` component whether its grid role is
   * active. Reading `#roleContext`'s signal-backed value here (rather than
   * having `sky-tokens` push the value in imperatively) lets this OnPush
   * component's view update automatically when that ancestor state changes.
   * @internal
   */
  protected readonly effectiveRole = computed(
    () =>
      this.role() ?? (this.#roleContext?.gridRoleActive() ? 'row' : undefined),
  );

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

  #elementRef = inject(ElementRef);

  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);
  readonly #roleContext = inject(SKY_TOKENS_ROLE_CONTEXT, { optional: true });

  #_disabled = false;
  #_dismissible = true;

  protected onFocusIn(): void {
    if (!this.isFocused) {
      this.tokenFocus.emit();
      this.isFocused = true;
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    this.isFocused = this.#elementRef.nativeElement.contains(
      event.relatedTarget,
    );
  }

  public dismissToken(event: Event): void {
    event.stopPropagation();
    this.#announceState(
      'skyux_tokens_token_dismissed',
      this.actionButtonRef?.nativeElement.textContent.trim(),
    );
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

  #announceState(resourceString: string, ...args: any[]): void {
    this.#resourcesSvc
      .getString(resourceString, ...args)
      .pipe(take(1))
      .subscribe((internationalizedString) => {
        this.#liveAnnouncerSvc.announce(internationalizedString);
      });
  }
}
