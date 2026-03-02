import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Item } from './item';

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
export class DashboardLinkCellRendererComponent implements ICellRendererAngularComp {
  protected value = '';

  public agInit(params: ICellRendererParams<Item, string>): void {
    this.value = params.value || '';
  }

  public refresh(params: ICellRendererParams<Item, string>): boolean {
    this.value = params.value || '';
    return true;
  }
}
