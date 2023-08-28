import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { Component } from '@angular/core';

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
