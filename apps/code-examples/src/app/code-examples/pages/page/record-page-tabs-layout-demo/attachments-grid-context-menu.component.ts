import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-attachments-grid-context-menu',
  templateUrl: './attachments-grid-context-menu.component.html',
})
export class AttachmentsGridContextMenuComponent
  implements ICellRendererAngularComp
{
  public attachmentName = '';

  public agInit(params: ICellRendererParams): void {
    this.attachmentName = params.data && params.data.name;
  }

  public refresh(): boolean {
    return false;
  }
}
