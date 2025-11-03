import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

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

  public agInit(params: ICellRendererParams): void {
    this.value = params.value || '';
  }

  public refresh(params: ICellRendererParams): boolean {
    this.value = params.value || '';
    return true;
  }
}
