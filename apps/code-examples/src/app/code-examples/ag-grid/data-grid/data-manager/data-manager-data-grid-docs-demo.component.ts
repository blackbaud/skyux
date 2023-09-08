import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { Subject, takeUntil } from 'rxjs';

import { AG_GRID_DEMO_DATA } from './data-manager-data-grid-docs-demo-data';
import { DataManagerDataGridDemoFiltersModalComponent } from './data-manager-data-grid-docs-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-data-grid-demo',
  templateUrl: './data-manager-data-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class DataManagerDataGridDemoComponent implements OnInit, OnDestroy {
  protected items = AG_GRID_DEMO_DATA;

  #activeViewId = 'dataGridWithDataManagerView';

  #dataManagerConfig = {
    filterModalComponent: DataManagerDataGridDemoFiltersModalComponent,
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
        viewId: 'dataGridWithDataManagerView',
        columnIds: [
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
        ],
        displayedColumnIds: [
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
