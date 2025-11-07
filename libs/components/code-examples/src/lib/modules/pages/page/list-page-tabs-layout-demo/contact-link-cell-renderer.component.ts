import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Contact } from './contact';

/**
 * Cell renderer for contact name links.
 */
@Component({
  selector: 'app-contact-link-cell-renderer',
  template: `<a
    href="/"
    [attr.aria-label]="'View contact details for ' + value"
    >{{ value }}</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLinkCellRendererComponent
  implements ICellRendererAngularComp
{
  protected value = '';

  public agInit(params: ICellRendererParams<Contact, string>): void {
    this.value = params.value || '';
  }

  public refresh(params: ICellRendererParams<Contact, string>): boolean {
    this.value = params.value || '';
    return true;
  }
}
