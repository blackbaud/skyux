import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import {
  SkySplitViewMessage,
  SkySplitViewMessageType,
  SkySplitViewModule,
} from '@skyux/split-view';

import { Subject } from 'rxjs';

interface WorkspaceItem {
  id: number;
  amount: number;
  date: string;
  vendor: string;
  receiptImage: string;
  approvedAmount: number;
  comments: string;
}

@Component({
  selector: 'app-split-view-page-content',
  templateUrl: './split-view-page-content.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDescriptionListModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
  ],
})
export class SplitViewPageContentComponent {
  protected set activeIndex(value: number) {
    this.#_activeIndex = value;
    this.activeRecord = this.items[this.#_activeIndex];
    this.#loadFormGroup(this.activeRecord);
  }

  protected get activeIndex(): number {
    return this.#_activeIndex;
  }

  protected items: WorkspaceItem[] = [
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
      vendor: 'Wish',
      receiptImage: 'wish-delivery-order.png',
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
      vendor: 'Home Depot',
      receiptImage: 'home-depot-order.png',
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

  protected activeRecord = this.items[0];
  protected listWidth: number | undefined;
  protected splitViewStream = new Subject<SkySplitViewMessage>();

  protected splitViewDemoForm = inject(FormBuilder).group({
    approvedAmount: [this.activeRecord.approvedAmount],
    comments: [this.activeRecord.comments],
  });

  #_activeIndex = 0;

  #confirmSvc = inject(SkyConfirmService);

  protected onItemClick(index: number): void {
    // Prevent workspace from loading new data if the current workspace form is dirty.
    if (this.splitViewDemoForm.dirty && index !== this.activeIndex) {
      this.#openConfirmModal(index);
    } else {
      this.#loadWorkspace(index);
    }
  }

  protected onApprove(): void {
    console.log('Approved clicked!');
    this.#saveForm();
  }

  protected onDeny(): void {
    console.log('Denied clicked!');
  }

  #loadFormGroup(record: WorkspaceItem): void {
    this.splitViewDemoForm.setValue({
      approvedAmount: record.approvedAmount,
      comments: record.comments,
    });
  }

  #loadWorkspace(index: number): void {
    this.activeIndex = index;
    this.#setFocusInWorkspace();
  }

  #openConfirmModal(index: number): void {
    this.#confirmSvc
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
      .closed.subscribe((closeArgs) => {
        if (closeArgs.action === 'yes') {
          this.#saveForm();
        }

        this.#loadWorkspace(index);
      });
  }

  #saveForm(): void {
    this.activeRecord = Object.assign(
      this.activeRecord,
      this.splitViewDemoForm.value,
    );

    this.splitViewDemoForm.markAsPristine();
  }

  #setFocusInWorkspace(): void {
    this.splitViewStream.next({
      type: SkySplitViewMessageType.FocusWorkspace,
    });
  }
}
