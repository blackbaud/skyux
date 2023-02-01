import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Creates an accessible button that wraps the chevron icon.
 * @internal
 */
@Component({
  selector: 'sky-chevron',
  styleUrls: ['./chevron.component.scss'],
  templateUrl: './chevron.component.html',
})
export class SkyChevronComponent {
  /**
   * Specifies the element whose contents are controlled by the chevron.
   * This sets the chevron's aria-controls attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA Definitions of States and Properties](https://www.w3.org/TR/wai-aria/#aria-controls).
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * Specifies an ARIA label for the chevron. This sets the chevron's aria-label attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA Definitions of States and Properties](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Specifies whether the chevron points up or down.
   */
  @Input()
  public set direction(value: string | undefined) {
    /* istanbul ignore else */
    if (value != this.directionOrDefault) {
      this.directionOrDefault = value ? value : 'up';
      /* istanbul ignore else */
      if (this.directionOrDefault === 'up') {
        this.ariaExpanded = true;
      } else if (this.directionOrDefault === 'down') {
        this.ariaExpanded = false;
      }
    }
  }

  /**
   * Indicates whether to disable the chevron button.
   */
  @Input()
  public disabled = false;

  /**
   * Fires when the direction of the chevron changes.
   */
  @Output()
  public directionChange = new EventEmitter<string>();

  public ariaExpanded = true;

  public directionOrDefault = 'up';

  public chevronClick(event: Event): void {
    event.stopPropagation();
    this.direction = this.directionOrDefault === 'up' ? 'down' : 'up';
    this.directionChange.emit(this.directionOrDefault);
  }
}
