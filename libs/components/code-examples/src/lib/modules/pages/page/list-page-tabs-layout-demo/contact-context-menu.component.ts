import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Contact } from './contact';

@Component({
  selector: 'app-contacts-grid-context-menu',
  templateUrl: './contact-context-menu.component.html',
  imports: [SkyDropdownModule],
})
export class ContactContextMenuComponent implements ICellRendererAngularComp {
  protected contactName = '';

  public agInit(params: ICellRendererParams<Contact>): void {
    this.contactName = params.data?.name ?? '';
  }

  public refresh(): boolean {
    return false;
  }
}
