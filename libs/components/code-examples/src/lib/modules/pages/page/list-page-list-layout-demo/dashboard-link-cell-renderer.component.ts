import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

/**
 * Cell renderer for dashboard name links.
 */
@Component({
  selector: 'app-dashboard-link-cell-renderer',
  template: `<a
    href="/"
    [attr.aria-label]="'View dashboard details for ' + value"
    >{{ value }}</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLinkCellRendererComponent
  implements ICellRendererAngularComp
{
  protected value = '';

  public agInit(params: ICellRendererParams): void {
    this.value = params.value || '';
  }

  public refresh(params: ICellRendererParams): boolean {
    this.value = params.value || '';
    return true;
  }
}
