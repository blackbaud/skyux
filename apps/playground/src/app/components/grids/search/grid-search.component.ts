import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkyGridColumnComponent, SkyGridComponent } from '@skyux/grids';
import { SkyGridOptions } from '@skyux/grids';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-grid-search',
  standalone: true,
  imports: [CommonModule, SkyGridComponent, SkyGridColumnComponent],
  templateUrl: './grid-search.component.html',
})
export default class GridSearchComponent {
  @Input()
  public page = 1;

  protected readonly data = AG_GRID_DEMO_DATA;
  protected readonly options: Partial<SkyGridOptions> = {
    searchEnabled: true,
  };
}
