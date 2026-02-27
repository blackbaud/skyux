import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { GridComponent } from './grid.component';

const GRID_VIEW = 'gridView';

@Component({
  imports: [CommonModule, GridComponent, SkyAgGridModule, SkyDataManagerModule],
  providers: [SkyDataManagerService],
  selector: 'app-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  #dataMgrSvc = inject(SkyDataManagerService);

  protected readonly viewId = GRID_VIEW;

  public ngOnInit(): void {
    this.#dataMgrSvc.initDataManager({
      activeViewId: GRID_VIEW,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        activeSortOption: undefined,
        views: [
          {
            viewId: GRID_VIEW,
            columnIds: ['name', 'occupation'],
            displayedColumnIds: ['name', 'occupation'],
          },
        ],
      }),
    });
  }
}
