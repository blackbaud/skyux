import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies content to display in the tile's summary.
 */
@Component({
  selector: 'sky-tile-summary',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: 'tile-summary.component.html',
})
export class SkyTileSummaryComponent {}
