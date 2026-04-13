import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Attachment } from './attachment';

/**
 * Cell renderer for attachment name links.
 */
@Component({
  selector: 'app-attachment-link-cell-renderer',
  template: `<a
    href="/"
    [attr.aria-label]="'View attachment details for ' + value"
    >{{ value }}</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentLinkCellRendererComponent implements ICellRendererAngularComp {
  protected value = '';

  public agInit(params: ICellRendererParams<Attachment, string>): void {
    this.value = params.value || '';
  }

  public refresh(params: ICellRendererParams<Attachment, string>): boolean {
    this.value = params.value || '';
    return true;
  }
}
