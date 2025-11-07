import { Component } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-grid-search',
  imports: [SkyGridModule],
  templateUrl: './grid-search.component.html',
})
export default class GridSearchComponent {
  protected readonly data = AG_GRID_DEMO_DATA;
}
