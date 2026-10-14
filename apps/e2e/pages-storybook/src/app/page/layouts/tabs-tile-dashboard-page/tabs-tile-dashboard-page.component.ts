import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { PageLayoutTileDashboardComponent } from '../shared/tiles/tile-dashboard.component';

@Component({
  imports: [
    SkyButton,
    PageLayoutTileDashboardComponent,
    SkyPageModule,
    SkyTabsModule,
  ],
  selector: 'app-tabs-tile-dashboard-page',
  template: `<sky-page layout="tabs">
    <sky-page-header pageTitle="Tabs page">
      <sky-page-header-actions>
        <sky-button labelText="Action one" />
        <sky-button labelText="Action two" />
      </sky-page-header-actions>
    </sky-page-header>
    <sky-page-content>
      <sky-tabset>
        <sky-tab layout="blocks" tabHeading="Tab 1">
          <app-page-layout-tile-dashboard />
        </sky-tab>
      </sky-tabset>
    </sky-page-content>
  </sky-page>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class TabsTileDashboardPageComponent {}
