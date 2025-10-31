import { Component, input } from '@angular/core';
import { SkyAgGridColumnComponent, SkyAgGridComponent } from '@skyux/ag-grid';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyAgGridComponent, SkyAgGridColumnComponent],
  templateUrl: './grid-paging.component.html',
})
export default class GridPagingComponent {
  public readonly page = input<string>();

  protected readonly data = AG_GRID_DEMO_DATA;
}
