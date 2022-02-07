import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService,
} from '@skyux/data-manager';

import { SkyDataManagerDataEntryGridContextMenuComponent } from './data-manager-data-entry-grid-docs-demo-context-menu.component';
import { SKY_AG_GRID_DEMO_DATA } from './data-manager-data-entry-grid-docs-demo-data';
import { SkyDataEntryGridEditModalContext } from './data-manager-data-entry-grid-docs-demo-edit-modal-context';
import { SkyDataManagerDataEntryGridEditModalComponent } from './data-manager-data-entry-grid-docs-demo-edit-modal.component';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';
import { DataManagerDataEntryGridDocsDemoFiltersModalComponent } from './data-manager-data-entry-grid-docs-demo-filter-modal.component';
import { DataManagerDataEntryGridDocsDemoViewGridComponent } from './data-manager-data-entry-grid-docs-demo-view-grid.component';

@Component({
  selector: 'app-data-manager-data-entry-grid-docs-demo',
  templateUrl: './data-manager-data-entry-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class SkyDataManagerDataEntryGridDemoComponent implements OnInit {
  public items = SKY_AG_GRID_DEMO_DATA;

  public activeViewId = 'dataEntryGridWithDataManagerView';

  public dataState = new SkyDataManagerState({});

  public dataManagerConfig = {
    filterModalComponent: DataManagerDataEntryGridDocsDemoFiltersModalComponent,
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
    private modalService: SkyModalService
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
    const context = new SkyDataEntryGridEditModalContext();
    context.gridData = this.items.slice();
    this.changeDetector.markForCheck();

    const options = {
      providers: [
        { provide: SkyDataEntryGridEditModalContext, useValue: context },
      ],
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      size: 'large',
    };

    const modalInstance = this.modalService.open(
      SkyDataManagerDataEntryGridEditModalComponent,
      options
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
