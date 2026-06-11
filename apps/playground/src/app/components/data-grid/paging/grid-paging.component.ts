import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyDataGridComponent, SkyDataGridColumnComponent],
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
}
