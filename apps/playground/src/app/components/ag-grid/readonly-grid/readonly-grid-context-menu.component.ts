import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-readonly-grid-context-menu',
  templateUrl: './readonly-grid-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule],
})
export class ReadonlyGridContextMenuComponent
  implements ICellRendererAngularComp
{
  public goalName: string;
  private params: ICellRendererParams;

  public agInit(params: ICellRendererParams): void {
    this.params = params;
    this.goalName = this.params.data && this.params.data.name;
  }

  public refresh(): boolean {
    return false;
  }

  public actionClicked(action: string): void {
    alert(`${action} clicked for ${this.goalName}`);
  }

  public triggerRowDelete(): void {
    this.params.context.rowDeleteIds = this.params.context.rowDeleteIds.concat(
      this.params.data.id.toString(),
    );
  }
}
