import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  resource,
  signal,
} from '@angular/core';
import {
  SkyDataGrid,
  SkyDataGridColumn,
  SkyDataGridSort,
} from '@skyux/data-grid';

import {
  columnDefinitions as baseballColumnDefinitions,
  data as baseballData,
  DataType,
} from '../../../shared/data-manager/baseball-players-data';
import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyDataGrid, SkyDataGridColumn],
  templateUrl: './grid-paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GridPagingComponent {
  public readonly page = input<unknown, number>(undefined, {
    transform: numberAttribute,
  });
  protected readonly data = AG_GRID_DEMO_DATA.map((row, idx) => ({
    id: `idx${idx}`,
    ...row,
  }));

  protected readonly asyncSort = signal<SkyDataGridSort>({
    field: 'name',
    direction: 'asc',
  });
  protected readonly asyncPage = signal(1);
  protected readonly asyncPageSize = 5;
  protected readonly asyncDataResource = resource({
    params: () => ({
      dataSorted: this.#asyncDataSorted(),
      page: this.asyncPage(),
    }),
    loader: async ({ params }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        data: params.dataSorted.slice(
          (params.page - 1) * this.asyncPageSize,
          params.page * this.asyncPageSize,
        ),
        rowCount: params.dataSorted.length,
      };
    },
  });
  protected readonly asyncDataGridColumns = baseballColumnDefinitions;
  readonly #asyncDataSorted = computed(() => {
    const sort = this.asyncSort();
    const rows = [...baseballData];
    if (sort) {
      const field = sort.field as keyof DataType;
      const descending = sort.direction === 'desc';
      const sortType = baseballColumnDefinitions.find(
        (col) => col.field === field,
      )?.dataType;
      switch (sortType) {
        case 'text':
          rows.sort((a, b) => {
            const aValue = a[field] as string;
            const bValue = b[field] as string;
            return descending
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          });
          break;
        case 'number':
          rows.sort((a, b) => {
            const aValue = a[field] as number;
            const bValue = b[field] as number;
            return descending ? bValue - aValue : aValue - bValue;
          });
          break;
        case 'date':
          rows.sort((a, b) => {
            const aValue = new Date(a[field] as string).getTime();
            const bValue = new Date(b[field] as string).getTime();
            return descending ? bValue - aValue : aValue - bValue;
          });
          break;
        case 'boolean':
          rows.sort((a, b) => {
            const aValue = a[field] ? 0 : 1;
            const bValue = b[field] ? 0 : 1;
            return descending ? bValue - aValue : aValue - bValue;
          });
          break;
        default:
          break;
      }
    }
    return rows;
  });
}
