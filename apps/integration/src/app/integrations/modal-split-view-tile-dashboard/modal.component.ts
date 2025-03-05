import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkySplitViewModule } from '@skyux/split-view';
import { SkyTileDashboardConfig, SkyTilesModule } from '@skyux/tiles';

import { ModalDemoContext } from './context';
import { TestRecord } from './record';
import { Tile1Component } from './tile1.component';
import { Tile2Component } from './tile2.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyTilesModule,
    SkySplitViewModule,
    SkyRepeaterModule,
  ],
})
export class ModalComponent {
  protected dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile1',
        componentType: Tile1Component,
      },
      {
        id: 'tile2',
        componentType: Tile2Component,
      },
    ],
    layout: {
      singleColumn: {
        tiles: [
          {
            id: 'tile2',
            isCollapsed: false,
          },
          {
            id: 'tile1',
            isCollapsed: true,
          },
        ],
      },
      multiColumn: [
        {
          tiles: [
            {
              id: 'tile1',
              isCollapsed: true,
            },
          ],
        },
        {
          tiles: [
            {
              id: 'tile2',
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  };
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  readonly #context = inject(ModalDemoContext);

  protected items = [
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

  protected activeRecord: TestRecord = this.items[0];
  protected layout = this.#context.layout ?? 'none';
  protected readonly instance = inject(SkyModalInstance);

  constructor() {
    this.demoForm = new FormGroup({
      value1: new FormControl(this.#context.data.value1),
    });
  }
}
