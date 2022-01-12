import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-data-entry-grid-docs-demo-context-menu',
  templateUrl: './data-entry-grid-docs-demo-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataEntryGridContextMenuComponent
  implements ICellRendererAngularComp
{
  private name: string = '';

  public agInit(params: ICellRendererParams): void {
    this.name = params.data && params.data.name;
  }

  public refresh(): boolean {
    return false;
  }

  public actionClicked(action: string): void {
    alert(`${action} clicked for ${this.name}`);
  }
}
