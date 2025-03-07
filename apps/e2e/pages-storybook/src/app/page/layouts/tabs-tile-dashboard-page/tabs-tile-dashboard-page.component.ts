import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyPageModule } from '@skyux/pages';
import { FontLoadingService } from '@skyux/storybook';
import { SkyTabsModule } from '@skyux/tabs';

import { PageLayoutTileDashboardComponent } from '../shared/tiles/tile-dashboard.component';

@Component({
  standalone: true,
  imports: [PageLayoutTileDashboardComponent, SkyPageModule, SkyTabsModule],
  selector: 'app-tabs-tile-dashboard-page',
  template: `<sky-page layout="tabs">
      <sky-page-header pageTitle="Tabs page">
        <sky-page-header-actions>
          <button class="sky-btn sky-btn-default" type="button">
            Action one
          </button>
          <button class="sky-btn sky-btn-default" type="button">
            Action two
          </button>
        </sky-page-header-actions>
      </sky-page-header>
      <sky-page-content>
        <sky-tabset>
          <sky-tab layout="blocks" tabHeading="Tab 1">
            <app-page-layout-tile-dashboard />
          </sky-tab>
        </sky-tabset>
      </sky-page-content>
    </sky-page>

    @if (ready()) {
      <span id="ready"></span>
    } `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class TabsTileDashboardPageComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
