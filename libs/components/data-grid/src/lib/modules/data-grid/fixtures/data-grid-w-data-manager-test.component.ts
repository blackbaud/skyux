import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { SkyDataGridModule } from '../data-grid.module';

interface RowModel {
  id: string;
  name: string;
  category: string;
}

@Component({
  selector: 'app-data-grid-w-data-manager-test',
  templateUrl: './data-grid-w-data-manager-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGridModule, SkyDataManagerModule],
  providers: [SkyDataManagerService],
})
export class DataGridWDataManagerTestComponent implements OnInit {
  public data: RowModel[] = [
    { id: '1', name: 'Apple', category: 'Fruit' },
    { id: '2', name: 'Banana', category: 'Fruit' },
    { id: '3', name: 'Carrot', category: 'Vegetable' },
  ];
  public viewId = 'my-view';
  public readonly dataManagerService = inject(SkyDataManagerService);

  public displayedColumnIds: string[] | undefined = ['name', 'category'];
  public searchEnabled = true;
  public columnPickerEnabled = true;

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: this.viewId,
            displayedColumnIds: this.displayedColumnIds,
          },
        ],
      }),
    });

    this.dataManagerService.initDataView({
      id: this.viewId,
      name: 'Grid View',
      iconName: 'table',
      searchEnabled: this.searchEnabled,
      columnPickerEnabled: this.columnPickerEnabled,
    });
  }
}
