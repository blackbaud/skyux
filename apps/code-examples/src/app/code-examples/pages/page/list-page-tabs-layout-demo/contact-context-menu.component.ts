import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { Component } from '@angular/core';

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
