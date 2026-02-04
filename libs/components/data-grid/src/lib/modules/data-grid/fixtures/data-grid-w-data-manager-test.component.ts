import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  model,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataGridSort } from '../../types/data-grid-sort';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { SkyDataGridModule } from '../data-grid.module';

interface RowModel {
  id: string;
  name: string | null;
  category: string | null;
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
    { id: '4', name: null, category: null },
  ];
  public viewId = 'my-view';
  public readonly dataManagerService = inject(SkyDataManagerService);

  public displayedColumnIds: string[] | undefined = ['name', 'category'];
  public searchEnabled = true;
  public columnPickerEnabled = true;

  public readonly dataManagerState = toSignal(
    this.dataManagerService.getDataStateUpdates(
      'DataGridWDataManagerTestComponent',
    ),
    { initialValue: new SkyDataManagerState({}) },
  );
  public sortField = model<SkyDataGridSort>();

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: {
        sortOptions: [
          {
            id: 'name',
            propertyName: 'name',
            label: 'Name',
            descending: false,
          },
          {
            id: 'category',
            propertyName: 'category',
            label: 'Category',
            descending: false,
          },
        ],
      },
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
