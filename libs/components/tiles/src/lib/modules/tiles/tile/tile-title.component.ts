import { Component, inject } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';

import { SKY_TILE_TITLE_ID } from './tile-title-id-token';

/**
 * Specifies content to display in the tile's title.
 */
@Component({
  selector: 'sky-tile-title',
  templateUrl: './tile-title.component.html',
  styleUrls: ['./tile-title.component.scss'],
  imports: [SkyTrimModule],
})
export class SkyTileTitleComponent {
  protected readonly tileTitleId = inject(SKY_TILE_TITLE_ID);
}
