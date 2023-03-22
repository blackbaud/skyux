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
   * The direction that the chevron points, which can be up or down.
   */
  @Input()
  public set direction(value: string | undefined) {
    /* istanbul ignore else */
    if (value !== this.directionOrDefault) {
      this.directionOrDefault = value ? value : 'up';
    }
  }

  public directionOrDefault = 'up';
}
