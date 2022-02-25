import { Component, Input } from '@angular/core';

/**
 * Displays a chevron icon.
 * @internal
 */
@Component({
  selector: 'sky-expansion-indicator',
  styleUrls: ['./expansion-indicator.component.scss'],
  templateUrl: './expansion-indicator.component.html',
})
export class SkyExpansionIndicatorComponent {
  /**
   * Specifies whether the chevron points up or down.
   */
  @Input()
  public set direction(value: string) {
    /* istanbul ignore else */
    if (value != this._direction) {
      this._direction = value;
    }
  }

  public get direction(): string {
    return this._direction || 'up';
  }

  private _direction: string;
}
