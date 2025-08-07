import {
  Component,
  EnvironmentInjector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { DragulaModule } from 'ng2-dragula';

import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';

let columnIdIndex = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-tile-dashboard-column',
  styleUrls: ['./tile-dashboard-column.component.scss'],
  templateUrl: './tile-dashboard-column.component.html',
  imports: [DragulaModule],
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyTileDashboardColumnComponent {
  public bagId: string;

  public columnId: string;

  @ViewChild('content', {
    read: ViewContainerRef,
    static: false,
  })
  public content: ViewContainerRef | undefined;

  #dashboardService: SkyTileDashboardService;

  constructor(
    public injector: EnvironmentInjector,
    dashboardService: SkyTileDashboardService,
  ) {
    this.#dashboardService = dashboardService;

    this.columnId = `tile-dashboard-column-${++columnIdIndex}`;

    this.bagId = this.#dashboardService.bagId;
  }
}
