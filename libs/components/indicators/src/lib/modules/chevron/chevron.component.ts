import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Creates an accessible button that wraps the chevron icon.
 * @internal
 */
@Component({
  selector: 'sky-chevron',
  styleUrls: [
    './chevron.default.component.scss',
    './chevron.modern.component.scss',
  ],
  templateUrl: './chevron.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
  standalone: false,
})
export class SkyChevronComponent {
  /**
   * The element whose contents are controlled by the chevron.
   * This sets the chevron's `aria-controls` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * The ARIA label for the chevron. This sets the chevron's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The direction that the chevron points, which can be up or down.
   */
  @Input()
  public set direction(value: string | undefined) {
    /* istanbul ignore else */
    if (value !== this.directionOrDefault) {
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
   * Whether to disable the chevron button.
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

  public chevronKeyDown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          this.direction = this.directionOrDefault === 'up' ? 'down' : 'up';
          this.directionChange.emit(this.directionOrDefault);
          event.preventDefault();
          event.stopPropagation();
          break;
        default:
          break;
      }
    }
  }
}
