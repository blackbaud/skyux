import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import {
  SkyFilterBarModule,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';
import { SkyListSummaryModule } from '@skyux/lists';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject, map, takeUntil } from 'rxjs';

import { AG_GRID_DEMO_DATA, AgGridDemoRow } from './data';
import { EditModalContext } from './edit-modal-context';
import { EditModalComponent } from './edit-modal.component';
import { ExampleService } from './example.service';
import { SalesModalComponent } from './sales-modal.component';
import { ViewGridComponent } from './view-grid.component';

const SOURCE_ID = 'data_entry_grid_data_manager_example_id';

/**
 * @title Data manager setup
 */
@Component({
  selector: 'app-ag-grid-data-entry-grid-data-manager-added-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [
    ViewGridComponent,
    SkyDataManagerModule,
    SkyFilterBarModule,
    SkyListSummaryModule,
  ],
})
export class AgGridDataEntryGridDataManagerAddedExampleComponent
  implements OnInit, OnDestroy
{
  protected items = AG_GRID_DEMO_DATA;

  protected salesModal = SalesModalComponent;

  #activeViewId = 'dataEntryGridWithDataManagerView';

  #defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {},
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
  readonly #exampleSvc = inject(ExampleService);
  readonly #modalSvc = inject(SkyModalService);

  protected readonly recordCount = toSignal(
    this.#dataManagerSvc
      .getDataSummaryUpdates(SOURCE_ID)
      .pipe(map((summary) => summary.itemsMatching)),
    { initialValue: 0 },
  );

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

  public onJobTitleSearchAsync(args: SkyFilterItemLookupSearchAsyncArgs): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#exampleSvc.search(args.searchText);
  }
}
