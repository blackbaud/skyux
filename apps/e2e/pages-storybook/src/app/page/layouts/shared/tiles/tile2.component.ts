import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.page-blocks-tile2',
  imports: [SkyHelpInlineModule, SkyTilesModule],
  template: `<sky-tile>
    <sky-tile-title>Tile 2</sky-tile-title>
    <sky-tile-content>
      <sky-tile-content-section>Section 1</sky-tile-content-section>
      <sky-tile-content-section>Section 2</sky-tile-content-section>
      <sky-tile-content-section>Section 3</sky-tile-content-section>
    </sky-tile-content>
  </sky-tile> `,
})
export class BlocksTileDashboardPageTile2Component {}
