import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { SkyTileComponent } from '../../tile/tile.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.sky-test-tile-1',
  templateUrl: './tile1.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile1TestComponent {
  @ViewChild(SkyTileComponent, {
    read: SkyTileComponent,
    static: false,
  })
  public tile: SkyTileComponent;

  public title = 'Tile 1';

  public tileSettingsClick() {}
}
