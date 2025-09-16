import { Component, OnInit, inject } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyDescriptionListModule,
  SkyFluidGridModule,
  SkyToolbarModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyPageModule } from '@skyux/pages';
import { SkySplitViewModule } from '@skyux/split-view';

@Component({
  selector: 'app-page-data-manager-split-view',
  templateUrl: './page-data-manager-split-view.component.html',
  styleUrls: ['./page-data-manager-split-view.component.scss'],
  imports: [
    SkySplitViewModule,
    SkyDataManagerModule,
    SkySummaryActionBarModule,
    SkyInputBoxModule,
    SkyDescriptionListModule,
    SkyRepeaterModule,
    SkyToolbarModule,
    SkyFluidGridModule,
    SkyPageModule,
  ],
  providers: [SkyDataManagerService],
})
export class PageDataManagerSplitViewComponent implements OnInit {
  public set activeIndex(value: number) {
    this._activeIndex = value;
    this.activeRecord = this.items[this._activeIndex];
  }

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public activeRecord: any;

  public hasUnsavedWork = false;

  public items = [
    {
      id: 1,
      amount: 73.19,
      date: '5/13/2020',
      vendor: 'amazon.com',
      receiptImage: 'amzn-office-supply-order-5-13-19.png',
      approvedAmount: 73.19,
      comments: '',
    },
    {
      id: 2,
      amount: 214.12,
      date: '5/14/2020',
      vendor: 'Office Max',
      receiptImage: 'office-max-order.png',
      approvedAmount: 214.12,
      comments: '',
    },
    {
      id: 3,
      amount: 29.99,
      date: '5/14/2020',
      vendor: 'amazon.com',
      receiptImage: 'amzn-office-supply-order-5-14-19.png',
      approvedAmount: 29.99,
      comments: '',
    },
    {
      id: 4,
      amount: 1500,
      date: '5/15/2020',
      vendor: 'Fresh Catering, LLC',
      receiptImage: 'fresh-catering-llc-order.png',
      approvedAmount: 1500,
      comments: '',
    },
  ];

  private _activeIndex = 0;

  public dataManagerService = inject(SkyDataManagerService);
  public dock = undefined;

  constructor() {
    this.activeIndex = 0;
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: 'dataManagerView',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: 'dataManagerView',
          },
        ],
      }),
    });
    this.dataManagerService.initDataView(this.#splitViewConfig);
  }

  #splitViewConfig: SkyDataViewConfig = {
    id: 'dataManagerView',
    name: 'Split View Data Manager View',
    sortEnabled: true,
    searchEnabled: true,
    showSortButtonText: true,
    filterButtonEnabled: true,
    multiselectToolbarEnabled: true,
  };
}
