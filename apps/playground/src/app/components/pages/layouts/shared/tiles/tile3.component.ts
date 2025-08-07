import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyTilesModule],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.page-blocks-tile2',
  template: `
    <sky-tile>
      <sky-tile-title>Tile 3</sky-tile-title>
      <sky-tile-content>
        <sky-tile-content-section>Content here.</sky-tile-content-section>
      </sky-tile-content>
    </sky-tile>
  `,
})
export class BlocksTileDashboardPageTile3Component {}
