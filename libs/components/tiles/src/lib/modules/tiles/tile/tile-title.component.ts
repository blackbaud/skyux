import { Component } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';

/**
 * Specifies content to display in the tile's title.
 */
@Component({
  standalone: true,
  selector: 'sky-tile-title',
  templateUrl: './tile-title.component.html',
  styleUrls: ['./tile-title.component.scss'],
  imports: [SkyTrimModule],
})
export class SkyTileTitleComponent {}
