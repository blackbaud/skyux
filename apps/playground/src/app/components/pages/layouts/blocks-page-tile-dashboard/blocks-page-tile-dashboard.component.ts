import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import { PageLayoutTileDashboardComponent } from '../shared/tiles/tile-dashboard.component';

@Component({
  imports: [
    SkyFluidGridModule,
    SkyPageModule,
    PageLayoutTileDashboardComponent,
  ],
  template: `<sky-page layout="blocks">
    <sky-page-header
      pageTitle="Blocks page"
      [parentLink]="{
        label: 'Components',
        permalink: {
          route: {
            commands: ['/'],
          },
        },
      }"
    />
    <sky-page-content>
      <sky-fluid-grid gutterSize="medium" [disableMargin]="true">
        <sky-row>
          <sky-column [screenLarge]="9">
            <app-page-layout-tile-dashboard />
          </sky-column>
          <sky-column [screenLarge]="3">Other content</sky-column>
        </sky-row>
      </sky-fluid-grid>
    </sky-page-content>
  </sky-page> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksTileDashboardPageComponent {}
