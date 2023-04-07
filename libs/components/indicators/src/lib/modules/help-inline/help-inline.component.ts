import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sky-help-inline',
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss'],
})
export class SkyHelpInlineComponent {
  /**
   * The ID of the element that the help inline button controls.
   * This property [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * Whether an element controlled by the help inline button is expanded. When set to `true`, the property will only be applied to the HTML element when the `ariaControls` input is also set.
   * This property [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-expanded` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-expanded).
   */
  @Input()
  public ariaExpanded: boolean | undefined;

  /**
   * Fires when the user clicks the help inline button.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  public onClick(): void {
    this.actionClick.emit();
  }
}
