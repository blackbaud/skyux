import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-dashboards-grid-context-menu',
  templateUrl: './dashboards-grid-context-menu.component.html',
})
export class DashboardGridContextMenuComponent
  implements ICellRendererAngularComp
{
  public dashboardName = '';

  public agInit(params: ICellRendererParams): void {
    this.dashboardName = params.data && params.data.dashboard;
  }

  public refresh(): boolean {
    return false;
  }
}
