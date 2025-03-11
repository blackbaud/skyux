import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { PageLayoutTileDashboardComponent } from '../shared/tiles/tile-dashboard.component';

@Component({
  imports: [
    CommonModule,
    PageLayoutTileDashboardComponent,
    SkyAlertModule,
    SkyAvatarModule,
    SkyLabelModule,
    SkyPageModule,
  ],
  selector: 'app-blocks-tile-dashboard-page',
  template: `<sky-page layout="blocks">
    <sky-page-header
      pageTitle="Box with tile dashboard page"
      [parentLink]="{
        label: 'Components',
        permalink: {
          route: {
            commands: ['/'],
          },
        },
      }"
    >
      <sky-page-header-alerts>
        <sky-alert alertType="warning" descriptionType="warning">
          Urgent information about the page.
        </sky-alert>
      </sky-page-header-alerts>
      <sky-page-header-details>
        <sky-label labelType="info" descriptionType="important-info">
          Important information
        </sky-label>
      </sky-page-header-details>
      <sky-page-header-actions>
        <button class="sky-btn sky-btn-default" type="button">
          Action one
        </button>
        <button class="sky-btn sky-btn-default" type="button">
          Action two
        </button>
      </sky-page-header-actions>
      <sky-page-header-avatar>
        <sky-avatar name="Test name" />
      </sky-page-header-avatar>
    </sky-page-header>
    <sky-page-content>
      <app-page-layout-tile-dashboard />
    </sky-page-content>
  </sky-page>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export default class BlocksTileDashboardPageComponent {}
