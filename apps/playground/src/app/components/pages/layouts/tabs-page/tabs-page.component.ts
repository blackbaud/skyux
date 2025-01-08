import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { DataManagerVisualComponent } from '../../../ag-grid/data-manager/data-manager-visual.component';
import { SplitViewContentComponent } from '../shared/split-view-content/split-view-content.component';
import { PageLayoutTileDashboardComponent } from '../shared/tiles/tile-dashboard.component';

@Component({
  imports: [
    DataManagerVisualComponent,
    PageLayoutTileDashboardComponent,
    SkyPageModule,
    SkyTabsModule,
    SplitViewContentComponent,
  ],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabsPageComponent {}
