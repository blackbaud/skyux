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
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject, takeUntil } from 'rxjs';

import { AG_GRID_DEMO_DATA } from './data-manager-data-entry-grid-demo-data';
import { DataEntryGridEditModalContext } from './data-manager-data-entry-grid-demo-edit-modal-context';
import { DataManagerDataEntryGridEditModalComponent } from './data-manager-data-entry-grid-demo-edit-modal.component';
import { DataManagerDataEntryGridDemoFiltersModalComponent } from './data-manager-data-entry-grid-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-data-entry-grid-demo',
  templateUrl: './data-manager-data-entry-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class DataManagerDataEntryGridDemoComponent
  implements OnInit, OnDestroy
{
  protected items = AG_GRID_DEMO_DATA;

  #activeViewId = 'dataEntryGridWithDataManagerView';

  #defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {
        hideSales: false,
      },
    },
    views: [
      {
        viewId: 'dataEntryGridWithDataManagerView',
        displayedColumnIds: [
          'selected',
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
          'validationCurrency',
          'validationDate',
        ],
      },
    ],
  });

  #dataManagerConfig = {
    filterModalComponent: DataManagerDataEntryGridDemoFiltersModalComponent,
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

  #ngUnsubscribe = new Subject<void>();

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #modalSvc = inject(SkyModalService);

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

  protected openModal(): void {
    const context = new DataEntryGridEditModalContext();
    context.gridData = this.items.slice();

    this.#changeDetectorRef.markForCheck();

    const options: SkyModalConfigurationInterface = {
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      providers: [
        {
          provide: DataEntryGridEditModalContext,
          useValue: context,
        },
      ],
      size: 'large',
    };

    const modalInstance = this.#modalSvc.open(
      DataManagerDataEntryGridEditModalComponent,
      options
    );

    modalInstance.closed.subscribe((result) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.items = result.data;
        alert('Saving data!');
      }

      this.#changeDetectorRef.markForCheck();
    });
  }
}
