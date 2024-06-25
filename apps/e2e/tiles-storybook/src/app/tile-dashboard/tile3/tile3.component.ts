import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

import { TileParameters } from '../tile-parameters.token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyTilesModule],
  selector: 'app-tile3',
  standalone: true,
  template: `
    <sky-tile
      [helpPopoverContent]="
        tileParameters.showInlineHelp ? 'Sample help content' : undefined
      "
      [tileName]="tileParameters.tileName"
    >
      <sky-tile-title>
        {{ tileParameters.tileName }}
      </sky-tile-title>
      <sky-tile-content>
        <sky-tile-content-section> Section 1 </sky-tile-content-section>
        <sky-tile-content-section> Section 2 </sky-tile-content-section>
        <sky-tile-content-section> Section 3 </sky-tile-content-section>
      </sky-tile-content>
    </sky-tile>
  `,
})
export class Tile3Component {
  protected tileParameters = inject(TileParameters);
}
