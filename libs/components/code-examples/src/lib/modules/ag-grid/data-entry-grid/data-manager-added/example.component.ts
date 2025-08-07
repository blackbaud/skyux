import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject, takeUntil } from 'rxjs';

import { AG_GRID_DEMO_DATA, AgGridDemoRow } from './data';
import { EditModalContext } from './edit-modal-context';
import { EditModalComponent } from './edit-modal.component';
import { FilterModalComponent } from './filter-modal.component';
import { ViewGridComponent } from './view-grid.component';

/**
 * @title Data manager setup
 */
@Component({
  selector: 'app-ag-grid-data-entry-grid-data-manager-added-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [ViewGridComponent, SkyDataManagerModule],
})
export class AgGridDataEntryGridDataManagerAddedExampleComponent
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
          'context',
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
    filterModalComponent: FilterModalComponent,
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
    const context = new EditModalContext();
    context.gridData = this.items.slice();

    this.#changeDetectorRef.markForCheck();

    const options: SkyModalConfigurationInterface = {
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      providers: [
        {
          provide: EditModalContext,
          useValue: context,
        },
      ],
      size: 'large',
    };

    const modalInstance = this.#modalSvc.open(EditModalComponent, options);

    modalInstance.closed.subscribe((result) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.items = result.data as AgGridDemoRow[];
        alert('Saving data!');
      }

      this.#changeDetectorRef.markForCheck();
    });
  }
}
