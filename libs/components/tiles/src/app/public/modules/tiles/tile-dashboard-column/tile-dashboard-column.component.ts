import {
  Component,
  ComponentFactoryResolver,
  Injector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';

let columnIdIndex = 0;

@Component({
  selector: 'sky-tile-dashboard-column',
  styleUrls: ['./tile-dashboard-column.component.scss'],
  templateUrl: './tile-dashboard-column.component.html'
})
export class SkyTileDashboardColumnComponent {
  public bagId: string;

  public columnId: string;

  @ViewChild('content', {read: ViewContainerRef})
  public content: ViewContainerRef;

  constructor(
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    private dashboardService: SkyTileDashboardService
  ) {
    columnIdIndex++;

    this.columnId = 'tile-dashboard-column-' + columnIdIndex;

    this.bagId = this.dashboardService.bagId;
  }
}
