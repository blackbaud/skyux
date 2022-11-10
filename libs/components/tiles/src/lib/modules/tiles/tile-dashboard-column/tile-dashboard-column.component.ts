import { Component, ElementRef, Injector, ViewChild } from '@angular/core';

import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';

let columnIdIndex = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-tile-dashboard-column',
  styleUrls: ['./tile-dashboard-column.component.scss'],
  templateUrl: './tile-dashboard-column.component.html',
})
export class SkyTileDashboardColumnComponent {
  public bagId: string;

  public columnId: string;

  @ViewChild('content', {
    read: ElementRef,
    static: false,
  })
  public content: ElementRef | undefined;

  #dashboardService: SkyTileDashboardService;

  constructor(
    public injector: Injector,
    dashboardService: SkyTileDashboardService
  ) {
    this.#dashboardService = dashboardService;

    this.columnId = `tile-dashboard-column-${++columnIdIndex}`;

    this.bagId = this.#dashboardService.bagId;
  }
}
