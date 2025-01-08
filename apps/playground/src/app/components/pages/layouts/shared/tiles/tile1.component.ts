import { Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.page-blocks-tile1',
  imports: [SkyTilesModule],
  template: `<sky-tile
    helpPopoverContent="Sample help information for tile 1."
    helpPopoverTitle="Sample help content"
    tileName="Tile 1"
  >
    <sky-tile-title>Tile 1</sky-tile-title>
    <sky-tile-summary>Tile summary</sky-tile-summary>
    <sky-tile-content>
      <sky-tile-content-section>Hi</sky-tile-content-section>
    </sky-tile-content>
  </sky-tile> `,
})
export class BlocksTileDashboardPageTile1Component {}
