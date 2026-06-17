import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies the content to display in the body of the card.
 * @deprecated
 */
@Component({
  selector: 'sky-card-content',
  templateUrl: './card-content.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyCardContentComponent {}
