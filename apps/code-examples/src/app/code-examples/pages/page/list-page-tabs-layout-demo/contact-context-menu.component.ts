import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-contacts-grid-context-menu',
  templateUrl: './contact-context-menu.component.html',
})
export class ContactContextMenuComponent implements ICellRendererAngularComp {
  public contactName = '';

  public agInit(params: ICellRendererParams): void {
    this.contactName = params.data && params.data.name;
  }

  public refresh(): boolean {
    return false;
  }
}
