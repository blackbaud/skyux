import { ChangeDetectorRef, Component } from '@angular/core';
import { SkyConfirmService } from '@skyux/modals';
import { SkySplitViewMessage } from '@skyux/split-view';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  standalone: false,
})
export class SplitViewComponent {
  public set activeIndex(value: number) {
    this._activeIndex = value;
    this.activeRecord = this.items[this._activeIndex];
  }

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public activeRecord: any;

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

  public splitViewStream = new Subject<SkySplitViewMessage>();

  private _activeIndex = 0;

  constructor(
    public changeRef: ChangeDetectorRef,
    public confirmService: SkyConfirmService,
  ) {
    // Start with the first item selected.
    this.activeIndex = 0;
  }
}
