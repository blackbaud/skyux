import { Component } from '@angular/core';
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
  selector: 'app-split-view-demo',
  templateUrl: './split-view-demo.component.html',
})
export class SplitViewDemoComponent {
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
  ];

  public listWidth: number;

  public splitViewDemoForm: FormGroup;

  public splitViewStream = new Subject<SkySplitViewMessage>();

  private _activeIndex = 0;

  constructor(public confirmService: SkyConfirmService) {
    // Start with the first item selected.
    this.activeIndex = 0;
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
    this.activeRecord.approvedAmount =
      this.splitViewDemoForm.value.approvedAmount;
    this.activeRecord.comments = this.splitViewDemoForm.value.comments;
    this.splitViewDemoForm.reset(this.splitViewDemoForm.value);
  }

  private setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace,
    };
    this.splitViewStream.next(message);
  }
}
