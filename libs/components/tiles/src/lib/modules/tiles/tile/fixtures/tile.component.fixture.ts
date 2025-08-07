import { Component, ViewChild } from '@angular/core';

import { SkyTilesModule } from '../../tiles.module';
import { SkyTileComponent } from '../tile.component';

@Component({
  imports: [SkyTilesModule],
  selector: 'sky-test-cmp',
  templateUrl: './tile.component.fixture.html',
})
export class TileTestComponent {
  @ViewChild(SkyTileComponent)
  public tileComponent!: SkyTileComponent;

  public collapsedOutputCalled = false;

  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;

  public tileIsCollapsed = false;

  public tileName: any = 'test';

  public tileSettingsClick(): void {}

  public tileHelpClick(): void {}

  public collapsedStateCallback(isCollapsed: boolean): void {
    this.collapsedOutputCalled = isCollapsed;
  }
}
