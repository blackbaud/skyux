import { Component, input } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyGridModule],
  templateUrl: './grid-paging.component.html',
})
export default class GridPagingComponent {
  public readonly page = input<string>();

  protected readonly data = AG_GRID_DEMO_DATA;
}
