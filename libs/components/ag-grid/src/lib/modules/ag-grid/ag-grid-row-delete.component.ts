import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SkyInlineDeleteModule } from '@skyux/layout';

/**
 * Component for rendering the inline delete template in the overlay.
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-row-delete',
  template: `
    <ng-template
      #inlineDeleteTemplateRef
      let-row
      let-tableWidth="tableWidth()"
      let-getRowDeleteItem="getRowDeleteItem"
      let-cancelRowDelete="cancelRowDelete"
      let-confirmRowDelete="confirmRowDelete"
    >
      <div
        #inlineDeleteRef
        class="sky-ag-grid-row-delete"
        [id]="'row-delete-ref-' + row.id"
        [ngStyle]="{
          height: row.rowHeight + 'px',
          position: 'fixed',
          width: tableWidth + 'px',
        }"
      >
        <sky-inline-delete
          [pending]="getRowDeleteItem(row).pending"
          (cancelTriggered)="cancelRowDelete(row)"
          (deleteTriggered)="confirmRowDelete(row)"
        />
      </div>
    </ng-template>
  `,
  imports: [CommonModule, SkyInlineDeleteModule],
})
export class SkyAgGridRowDeleteComponent {
  @ViewChildren('inlineDeleteRef')
  public inlineDeleteRefs: QueryList<ElementRef> | undefined;

  @ViewChild('inlineDeleteTemplateRef', { read: TemplateRef })
  public inlineDeleteTemplateRef: TemplateRef<unknown> | undefined;
}
