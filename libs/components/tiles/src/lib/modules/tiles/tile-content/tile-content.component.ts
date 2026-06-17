import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies content to display in the tile's body.
 */
@Component({
  selector: 'sky-tile-content',
  styleUrl: './tile-content.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tile-content.component.html',
})
export class SkyTileContentComponent {}
