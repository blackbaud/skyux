import { Component, ViewChild } from '@angular/core';

import { SkyTileComponent } from '../tile.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tile.component.fixture.html',
})
export class TileTestComponent {
  @ViewChild(SkyTileComponent)
  public tileComponent: SkyTileComponent | undefined;

  public collapsedOutputCalled = false;

  public tileIsCollapsed = false;

  public tileName: any = 'test';

  public tileSettingsClick(): void {}

  public tileHelpClick(): void {}

  public collapsedStateCallback(isCollapsed: boolean): void {
    this.collapsedOutputCalled = isCollapsed;
  }
}
