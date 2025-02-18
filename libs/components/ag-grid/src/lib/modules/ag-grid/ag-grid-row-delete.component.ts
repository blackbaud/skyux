import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  TemplateRef,
  viewChild,
  viewChildren,
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
        [attr.data-row-id]="row.id"
        [ngStyle]="{
          height: row.rowHeight + 'px',
          position: 'fixed',
          top: '-100vh',
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
  imports: [NgStyle, SkyInlineDeleteModule],
})
export class SkyAgGridRowDeleteComponent {
  public readonly inlineDeleteRefs =
    viewChildren<ElementRef<HTMLDivElement>>('inlineDeleteRef');

  public readonly inlineDeleteTemplateRef = viewChild<TemplateRef<unknown>>(
    'inlineDeleteTemplateRef',
  );
}
