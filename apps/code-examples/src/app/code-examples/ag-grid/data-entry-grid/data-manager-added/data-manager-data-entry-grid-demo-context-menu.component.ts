import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-data-manager-data-entry-grid-demo-context-menu',
  templateUrl:
    './data-manager-data-entry-grid-demo-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule],
})
export class DataManagerDataEntryGridContextMenuComponent
  implements ICellRendererAngularComp
{
  #name = '';

  public agInit(params: ICellRendererParams): void {
    this.#name = params.data && params.data.name;
  }

  public refresh(): boolean {
    return false;
  }

  protected actionClicked(action: string): void {
    alert(`${action} clicked for ${this.#name}`);
  }
}
