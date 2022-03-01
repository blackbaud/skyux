import { Component, ViewChild } from '@angular/core';

import { SkyTileComponent } from '../tile.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tile.component.fixture.html',
})
export class TileTestComponent {
  @ViewChild(SkyTileComponent)
  public tileComponent: SkyTileComponent;

  public collapsedOutputCalled = false;

  public tileIsCollapsed = false;

  public tileName = 'test';

  public tileSettingsClick() {}

  public tileHelpClick() {}

  public collapsedStateCallback(isCollapsed: boolean) {
    this.collapsedOutputCalled = isCollapsed;
  }
}
