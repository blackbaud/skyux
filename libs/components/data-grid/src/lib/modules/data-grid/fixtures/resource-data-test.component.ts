import { Component, model, signal } from '@angular/core';
import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

interface ResourceRow {
  id: string;
  name: string;
}

@Component({
  selector: 'sky-resource-data-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  template: `
    <sky-data-grid
      data-sky-id="resource-grid"
      multiselect
      [data]="value()"
      [loading]="loading()"
      [(selectedRowIds)]="selectedRowIds"
    >
      <sky-data-grid-column field="name" headingText="Name" />
    </sky-data-grid>
  `,
})
export class ResourceDataTestComponent {
  public readonly selectedRowIds = model<string[]>([]);

  // Signals resembling a `Resource`-shaped object so a test can flip the loading
  // state and value exactly as a real resource would as it resolves.
  public readonly value = signal<ResourceRow[] | undefined>([]);
  public readonly loading = signal(true);
}
