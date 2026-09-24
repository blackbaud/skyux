import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a title to identify what the card represents.
 */
@Component({
  selector: 'sky-card-title',
  templateUrl: './card-title.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyCardTitleComponent {}
