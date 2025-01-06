import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { AG_GRID_DEMO_DATA } from './data-manager-data';
import { DataManagerEditModalContext } from './data-manager-edit-modal-context';
import { DataManagerEditModalComponent } from './data-manager-edit-modal.component';
import { DataManagerFiltersModalComponent } from './data-manager-filter-modal.component';

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  standalone: false,
})
export class DataManagerComponent implements OnInit {
  public items = AG_GRID_DEMO_DATA;

  public activeViewId = 'dataEntryGridWithDataManagerView';

  public dataState = new SkyDataManagerState({});

  public dataManagerConfig = {
    filterModalComponent: DataManagerFiltersModalComponent,
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

  public defaultDataState = new SkyDataManagerState({
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

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private modalService: SkyModalService,
  ) {
    this.dataManagerService
      .getDataStateUpdates('dataEntryGridDataManager')
      .subscribe((state) => {
        this.dataState = state;
        this.changeDetector.detectChanges();
      });
    this.dataManagerService
      .getActiveViewIdUpdates()
      .subscribe((activeViewId) => {
        this.activeViewId = activeViewId;
        this.changeDetector.detectChanges();
      });
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
    });
  }

  public openModal(): void {
    const context = new DataManagerEditModalContext();
    context.gridData = this.items.slice();
    this.changeDetector.markForCheck();

    const options = {
      providers: [{ provide: DataManagerEditModalContext, useValue: context }],
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      size: 'large',
    };

    const modalInstance = this.modalService.open(
      DataManagerEditModalComponent,
      options,
    );

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.items = result.data;
        alert('Saving data!');
      }
      this.changeDetector.markForCheck();
    });
  }
}
