import {
  Component,
  Resource,
  ResourceStatus,
  model,
  signal,
} from '@angular/core';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';

interface ResourceRow {
  id: string;
  name: string;
}

@Component({
  selector: 'sky-resource-data-test',
  imports: [SkyDataGridComponent, SkyDataGridColumnComponent],
  template: `
    <sky-data-grid
      data-sky-id="resource-grid"
      multiselect
      [data]="dataResource"
      [(selectedRowIds)]="selectedRowIds"
    >
      <sky-data-grid-column field="name" headingText="Name" />
    </sky-data-grid>
  `,
})
export class ResourceDataTestComponent {
  public readonly selectedRowIds = model<string[]>([]);

  // Signals back a `Resource`-shaped object so a test can flip the loading
  // state and value exactly as a real resource would as it resolves.
  public readonly value = signal<ResourceRow[] | undefined>([]);
  public readonly loading = signal(true);
  // When non-null, overrides the hasValue() return value regardless of `value`.
  public readonly hasValueOverride = signal<boolean | null>(null);

  public readonly dataResource = {
    value: this.value,
    isLoading: this.loading,
    status: signal<ResourceStatus>('loading'),
    error: signal<unknown>(undefined),
    hasValue: (): boolean => {
      const override = this.hasValueOverride();
      if (override !== null) return override;
      const val = this.value();
      return val !== undefined && val.length > 0;
    },
    reload: (): boolean => false,
  } as unknown as Resource<ResourceRow[]>;
}
