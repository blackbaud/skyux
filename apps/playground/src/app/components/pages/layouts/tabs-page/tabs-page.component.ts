import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { DataManagerVisualComponent } from '../../../ag-grid/data-manager/data-manager-visual.component';
import { SplitViewContentComponent } from '../shared/split-view-content/split-view-content.component';

@Component({
  standalone: true,
  imports: [
    DataManagerVisualComponent,
    SkyPageModule,
    SkyTabsModule,
    SplitViewContentComponent,
  ],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabsPageComponent {}
