import { Component, EventEmitter, Input, Output } from '@angular/core';

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
   */
  @Input()
  public ariaControls: string;

  /**
   * Specifies an ARIA label for the chevron. This sets the chevron's aria-label attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public ariaLabel: string;

  /**
   * Specifies whether the chevron points up or down.
   */
  @Input()
  public set direction(value: string) {
    /* istanbul ignore else */
    if (value != this._direction) {
      this._direction = value;
      /* istanbul ignore else */
      if (value === 'up') {
        this.ariaExpanded = true;
      } else if (this.direction === 'down') {
        this.ariaExpanded = false;
      }
    }
  }

  public get direction(): string {
    return this._direction || 'up';
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

  public ariaExpanded: boolean;

  private _direction: string;

  public chevronClick(event: Event): void {
    event.stopPropagation();
    this.direction = this.direction === 'up' ? 'down' : 'up';
    this.directionChange.emit(this.direction);
  }
}
