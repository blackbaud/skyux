import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkyGridColumnComponent, SkyGridComponent } from '@skyux/grids';
import { SkyGridOptions } from '@skyux/grids';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-grid-paging',
  standalone: true,
  imports: [CommonModule, SkyGridComponent, SkyGridColumnComponent],
  templateUrl: './grid-paging.component.html',
})
export default class GridPagingComponent {
  @Input()
  public page = 1;

  protected readonly data = AG_GRID_DEMO_DATA;
  protected readonly options: Partial<SkyGridOptions> = {
    pageSize: 5,
    pageQueryParam: 'page',
  };
}
