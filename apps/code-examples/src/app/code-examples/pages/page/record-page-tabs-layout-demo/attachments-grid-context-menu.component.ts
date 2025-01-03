import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Attachment } from './attachment';

@Component({
  selector: 'app-attachments-grid-context-menu',
  templateUrl: './attachments-grid-context-menu.component.html',
  imports: [SkyDropdownModule],
})
export class AttachmentsGridContextMenuComponent
  implements ICellRendererAngularComp
{
  protected attachmentName = '';

  public agInit(params: ICellRendererParams<Attachment>): void {
    this.attachmentName = params.data?.name ?? '';
  }

  public refresh(): boolean {
    return false;
  }
}
