import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  selector: 'sky-split-view-test',
  templateUrl: './split-view-fixture-test.component.html',
  standalone: false,
})
export class SplitViewTestComponent {
  public static dataSkyId = 'test-split-view';

  public set activeIndex(value: number) {
    this.#_activeIndex = value;
    this.activeRecord = this.items[this.#_activeIndex];
    this.#loadFormGroup(this.activeRecord);
  }

  public get activeIndex(): number {
    return this.#_activeIndex;
  }

  public activeRecord: any;

  public backButtonText = 'Back to list';

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

  public listAriaLabel = 'Transaction list';

  public listWidth: number | undefined;

  public splitViewDemoForm: UntypedFormGroup | undefined;

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public workspaceAriaLabel = 'Transaction form';

  #_activeIndex = 0;

  constructor(public confirmService: SkyConfirmService) {
    // Start with the first item selected.
    this.activeIndex = 0;
  }

  public onItemClick(index: number): void {
    // Prevent workspace from loading new data if the current workspace form is dirty.
    if (this.splitViewDemoForm?.dirty && index !== this.activeIndex) {
      this.#openConfirmModal(index);
    } else {
      this.#loadWorkspace(index);
    }
  }

  public onApprove(): void {
    console.log('Approved clicked!');
    this.#saveForm();
  }

  public onDeny(): void {
    console.log('Denied clicked!');
  }

  //#region helpers

  #loadFormGroup(record: any): void {
    this.splitViewDemoForm = new UntypedFormGroup({
      approvedAmount: new UntypedFormControl(record.approvedAmount),
      comments: new UntypedFormControl(record.comments),
    });
  }

  #loadWorkspace(index: number): void {
    this.activeIndex = index;
    this.#setFocusInWorkspace();
  }

  #openConfirmModal(index: number): void {
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
          this.#saveForm();
        }
        this.#loadWorkspace(index);
      });
  }

  #saveForm(): void {
    if (this.splitViewDemoForm) {
      this.activeRecord.approvedAmount =
        this.splitViewDemoForm.value.approvedAmount;
      this.activeRecord.comments = this.splitViewDemoForm.value.comments;
      this.splitViewDemoForm.reset(this.splitViewDemoForm.value);
    }
  }

  #setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace,
    };
    this.splitViewStream.next(message);
  }

  //#endregion helpers
}
