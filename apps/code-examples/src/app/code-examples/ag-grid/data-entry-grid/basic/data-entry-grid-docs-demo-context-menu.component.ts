import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-data-entry-grid-docs-demo-context-menu',
  templateUrl: './data-entry-grid-docs-demo-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule],
})
export class SkyDataEntryGridContextMenuComponent
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
