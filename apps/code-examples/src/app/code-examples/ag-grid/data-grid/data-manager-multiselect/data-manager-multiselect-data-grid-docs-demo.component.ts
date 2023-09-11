import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerConfig,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { Subject, takeUntil } from 'rxjs';

import { AG_GRID_DEMO_DATA } from './data-manager-multiselect-data-grid-docs-demo-data';
import { DataManagerMultiselectDataGridDemoFiltersModalComponent } from './data-manager-multiselect-data-grid-docs-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-multiselect-data-grid-docs-demo',
  templateUrl: './data-manager-multiselect-data-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class DataManagerMultiselectDataGridDemoComponent
  implements OnInit, OnDestroy
{
  protected items = AG_GRID_DEMO_DATA;

  #dataManagerConfig: SkyDataManagerConfig = {
    filterModalComponent:
      DataManagerMultiselectDataGridDemoFiltersModalComponent,
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A - Z)',
        descending: false,
        propertyName: 'name',
      },
      {
        id: 'za',
        label: 'Name (Z - A)',
        descending: true,
        propertyName: 'name',
      },
    ],
  };

  #defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {
        hideSales: false,
        jobTitle: 'any',
      },
    },
    views: [
      {
        viewId: 'dataGridMultiselectWithDataManagerView',
        columnIds: [
          'selected',
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
        ],
        displayedColumnIds: [
          'selected',
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
        ],
      },
    ],
  });

  #activeViewId = 'dataGridMultiselectWithDataManagerView';
  #ngUnsubscribe = new Subject<void>();

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);

  constructor() {
    this.#dataManagerSvc
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.#activeViewId = activeViewId;
        this.#changeDetectorRef.detectChanges();
      });
  }

  public ngOnInit(): void {
    this.#dataManagerSvc.initDataManager({
      activeViewId: this.#activeViewId,
      dataManagerConfig: this.#dataManagerConfig,
      defaultDataState: this.#defaultDataState,
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
