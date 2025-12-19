import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
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

import { map } from 'rxjs';

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
export class AgGridDataEntryGridDataManagerAddedExampleComponent {
  protected readonly items = signal<AgGridDemoRow[]>(AG_GRID_DEMO_DATA);

  protected readonly salesModal = SalesModalComponent;

  readonly #dataManagerConfig = {
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
    this.#dataManagerSvc.initDataManager({
      activeViewId: 'dataEntryGridWithDataManagerView',
      dataManagerConfig: this.#dataManagerConfig,
      defaultDataState: new SkyDataManagerState({}),
    });
  }

  protected openModal(): void {
    const context = new EditModalContext();
    context.gridData = structuredClone(this.items());

    this.#changeDetectorRef.markForCheck();

    const options: SkyModalConfigurationInterface = {
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
        this.items.set(result.data as AgGridDemoRow[]);
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
