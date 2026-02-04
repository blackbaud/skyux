import { SkyDataGridSort } from './data-grid-sort';

export interface SkyDataGridPageRequest {
  pageNumber: number;

  pageSize: number | undefined;

  sortField: SkyDataGridSort | undefined;
}
