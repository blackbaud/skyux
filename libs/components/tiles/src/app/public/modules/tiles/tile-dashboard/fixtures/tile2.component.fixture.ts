import {
  Component,
  Optional,
  ViewChild
} from '@angular/core';

import { SkyTileComponent } from '../../tile';

import { TileTestContext } from './tile-context.fixture';

@Component({
  // tslint:disable-next-line
  selector: 'div.sky-test-tile-2',
  templateUrl: './tile2.component.fixture.html'
})
export class Tile2TestComponent {
  @ViewChild(SkyTileComponent)
  public tile: SkyTileComponent;

  constructor(@Optional() public context: TileTestContext) { }

  public tileSettingsClick() { }
}
