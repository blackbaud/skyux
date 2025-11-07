import { Component } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-grid-paging',
  imports: [SkyGridModule],
  templateUrl: './grid-paging.component.html',
})
export default class GridPagingComponent {
  protected readonly data = AG_GRID_DEMO_DATA;
}
