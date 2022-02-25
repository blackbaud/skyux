import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import {
  SkyConfirmCloseEventArgs,
  SkyConfirmService,
  SkyConfirmType,
} from '@skyux/modals';

import {
  SkySplitViewMessage,
  SkySplitViewMessageType,
} from '@skyux/split-view';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-split-view-page-bound-demo',
  templateUrl: './split-view-page-bound-demo.component.html',
  styleUrls: ['./split-view-page-bound-demo.component.scss'],
})
export class SplitViewPageBoundDemoComponent implements OnInit {
  public set activeIndex(value: number) {
    this._activeIndex = value;
    this.activeRecord = this.items[this._activeIndex];
    this.loadFormGroup(this.activeRecord);
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
    {
      id: 5,
      amount: 456.24,
      date: '5/16/2020',
      vendor: 'Kerblam',
      receiptImage: 'kerblam-delivery-order.png',
      approvedAmount: 456.24,
      comments: '',
    },
    {
      id: 6,
      amount: 62.37,
      date: '5/16/2020',
      vendor: 'Staples',
      receiptImage: 'staples-paper-bulk-order.png',
      approvedAmount: 62.37,
      comments: '',
    },
    {
      id: 7,
      amount: 51.84,
      date: '5/17/2020',
      vendor: 'amazon.com',
      receiptImage: 'amzn-office-supply-order-5-17-19.png',
      approvedAmount: 51.84,
      comments: '',
    },
    {
      id: 8,
      amount: 92.55,
      date: '5/18/2020',
      vendor: 'Lowes',
      receiptImage: 'lowes-order.png',
      approvedAmount: 0.0,
      comments: '',
    },
    {
      id: 9,
      amount: 38.29,
      date: '5/18/2020',
      vendor: 'Papa Johns',
      receiptImage: 'papa-johns-order.png',
      approvedAmount: 38.29,
      comments: '',
    },
  ];

  public listWidth: number;

  public pageFlexOffsetTop: number;

  public splitViewDemoForm: FormGroup;

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public unapprovedTransaction = true;

  private _activeIndex = 0;

  constructor(public confirmService: SkyConfirmService) {
    // Start with the first item selected.
    this.activeIndex = 0;
  }

  public ngOnInit(): void {
    // Make any adjustments to the page's offset top to accommodate fixed-positioned elements,
    // such as a "sticky" navbar, etc.
    this.pageFlexOffsetTop = 0;
  }

  public onItemClick(index: number): void {
    // Prevent workspace from loading new data if the current workspace form is dirty.
    if (this.splitViewDemoForm.dirty && index !== this.activeIndex) {
      this.openConfirmModal(index);
    } else {
      this.loadWorkspace(index);
    }
  }

  public onApprove(): void {
    console.log('Approved clicked!');
    this.saveForm();
  }

  public onDeny(): void {
    console.log('Denied clicked!');
  }

  private loadFormGroup(record: any): void {
    this.splitViewDemoForm = new FormGroup({
      approvedAmount: new FormControl(record.approvedAmount),
      comments: new FormControl(record.comments),
    });
  }

  private loadWorkspace(index: number): void {
    this.activeIndex = index;
    this.setFocusInWorkspace();
  }

  private openConfirmModal(index: number): void {
    this.confirmService
      .open({
        message:
          'You have unsaved work. Would you like to save it before you change records?',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            action: 'yes',
            text: 'Yes',
            styleType: 'primary',
          },
          {
            action: 'discard',
            text: 'Discard changes',
            styleType: 'link',
          },
        ],
      })
      .closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
        if (closeArgs.action.toLowerCase() === 'yes') {
          this.saveForm();
        }
        this.loadWorkspace(index);
      });
  }

  private saveForm(): void {
    this.activeRecord.approvedAmount = parseFloat(
      this.splitViewDemoForm.value.approvedAmount
    );
    this.activeRecord.comments = this.splitViewDemoForm.value.comments;

    this.unapprovedTransaction =
      this.items.findIndex((item) => item.amount !== item.approvedAmount) >= 0;

    this.splitViewDemoForm.reset(this.splitViewDemoForm.value);
  }

  private setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace,
    };
    this.splitViewStream.next(message);
  }
}
