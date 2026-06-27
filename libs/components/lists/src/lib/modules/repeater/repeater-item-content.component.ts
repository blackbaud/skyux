import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays content text when the repeater is expanded.
 */
@Component({
  selector: 'sky-repeater-item-content',
  templateUrl: './repeater-item-content.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyRepeaterItemContentComponent {}
