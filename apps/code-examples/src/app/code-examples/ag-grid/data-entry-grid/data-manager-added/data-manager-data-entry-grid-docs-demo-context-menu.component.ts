import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-manager-data-entry-grid-docs-demo-context-menu',
  templateUrl:
    './data-manager-data-entry-grid-docs-demo-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataManagerDataEntryGridContextMenuComponent
  implements ICellRendererAngularComp
{
  private name = '';

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
