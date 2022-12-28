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
   * Whether the chevron points up or down.
   */
  @Input()
  public set direction(value: string | undefined) {
    /* istanbul ignore else */
    if (value != this.directionOrDefault) {
      this.directionOrDefault = value ? value : 'up';
    }
  }

  public directionOrDefault = 'up';
}
