import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  ViewChild,
} from '@angular/core';

import { SkyTileComponent } from '../../tile/tile.component';

import { TileTestContext } from './tile-context.fixture';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.sky-test-tile-2',
  templateUrl: './tile2.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile2TestComponent {
  @ViewChild(SkyTileComponent, {
    read: SkyTileComponent,
    static: false,
  })
  public tile: SkyTileComponent;

  constructor(@Optional() public context: TileTestContext) {}

  public tileSettingsClick() {}
}
