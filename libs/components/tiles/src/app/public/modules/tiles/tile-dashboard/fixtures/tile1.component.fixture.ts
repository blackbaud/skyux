import { Component, ViewChild } from '@angular/core';

import { SkyTileComponent } from '../../tile';

@Component({
  // tslint:disable-next-line
  selector: 'div.sky-test-tile-1',
  templateUrl: './tile1.component.fixture.html'
})
export class Tile1TestComponent {
  @ViewChild(SkyTileComponent)
  public tile: SkyTileComponent;

  public title = 'Tile 1';

  public tileSettingsClick() { }
}
