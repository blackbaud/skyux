import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays a header inside the repeater item.
 */
@Component({
  selector: 'sky-repeater-item-title',
  templateUrl: './repeater-item-title.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyRepeaterItemTitleComponent {}
