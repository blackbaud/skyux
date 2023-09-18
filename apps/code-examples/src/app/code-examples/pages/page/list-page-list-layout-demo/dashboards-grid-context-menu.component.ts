import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-dashboards-grid-context-menu',
  templateUrl: './dashboards-grid-context-menu.component.html',
  imports: [SkyDropdownModule],
})
export class DashboardGridContextMenuComponent
  implements ICellRendererAngularComp
{
  protected dashboardName = '';

  public agInit(params: ICellRendererParams): void {
    this.dashboardName = params.data && params.data.dashboard;
  }

  public refresh(): boolean {
    return false;
  }
}
