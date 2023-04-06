import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sky-help-inline',
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss'],
})
export class SkyHelpInlineComponent {
  /**
   * The ID to identify the element that the help inline button exposes.
   * This property [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   */
  @Input()
  public set ariaControls(value: string | undefined) {
    this.#_ariaControls = value;
    this.ariaExpandedComputed = value ? !!this.ariaExpanded : null;
  }

  public get ariaControls(): string | undefined {
    return this.#_ariaControls;
  }

  /**
   * Whether an element exposed by the help inline button is exposed. When set to `true`, the property will only be applied to the HTML element when the `ariaControls` input is also set.
   * This property [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-expanded` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-expanded).
   */
  @Input()
  public set ariaExpanded(value: boolean | undefined) {
    this.#_ariaExpanded = value;
    this.ariaExpandedComputed = this.ariaControls ? !!value : null;
  }

  public get ariaExpanded(): boolean | undefined {
    return this.#_ariaExpanded;
  }

  /**
   * Fires when the user clicks the help inline button.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  public ariaExpandedComputed: boolean | null = null;

  #_ariaControls: string | undefined;
  #_ariaExpanded: boolean | undefined = false;

  public onClick(): void {
    this.actionClick.emit();
  }
}
