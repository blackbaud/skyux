import {
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';

/**
 * Component for rendering the inline delete template in the overlay.
 * @internal
 */
@Component({
  template: `
    <ng-template
      let-row
      let-tableWidth="tableWidth()"
      let-getRowDeleteItem="getRowDeleteItem"
      let-cancelRowDelete="cancelRowDelete"
      let-confirmRowDelete="confirmRowDelete"
      #inlineDeleteTemplateRef
    >
      <div
        class="sky-ag-grid-row-delete"
        [id]="'row-delete-ref-' + row.id"
        [ngStyle]='{
          "height": row.rowHeight + "px",
          "position": "fixed",
          "width": tableWidth + "px"
        }'
        #inlineDeleteRef
      >
        <sky-inline-delete
          [pending]="getRowDeleteItem(row).pending"
          (cancelTriggered)="cancelRowDelete(row)"
          (deleteTriggered)="confirmRowDelete(row)"
        ></sky-inline-delete>
      </div>
    </ng-template>
  `
})
export class SkyAgGridRowDeleteComponent {

  @ViewChildren('inlineDeleteRef')
  public inlineDeleteRefs: QueryList<ElementRef>;
  @ViewChild('inlineDeleteTemplateRef', { read: TemplateRef })
  public inlineDeleteTemplateRef: TemplateRef<any>;

}
