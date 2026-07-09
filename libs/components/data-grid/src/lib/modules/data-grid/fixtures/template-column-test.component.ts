import { Component } from '@angular/core';
import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

@Component({
  selector: 'sky-template-column-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  template: `
    <sky-data-grid [data]="data">
      <sky-data-grid-column
        columnId="actions"
        headingText="Actions"
        width="40"
        [locked]="true"
        [sortable]="false"
      >
        <ng-template let-row="row">
          <!-- The control flow here verifies that templates with Angular controls build and render. -->
          @if (row.id) {
            <span class="custom-cell">Row {{ row.id }}: {{ row.column1 }}</span>
          }
        </ng-template>
      </sky-data-grid-column>
      <sky-data-grid-column field="column1" headingText="Column1" />
      <sky-data-grid-column field="column2" headingText="Column2" />
      <sky-data-grid-column field="date" dataType="date" headingText="Date" />
    </sky-data-grid>
  `,
})
export class TemplateColumnTestComponent {
  public data = [
    { id: '1', column1: 'A', column2: 'B', date: '2024-01-01' },
    { id: '2', column1: 'C', column2: 'D', date: '2024-02-01' },
  ];
}
