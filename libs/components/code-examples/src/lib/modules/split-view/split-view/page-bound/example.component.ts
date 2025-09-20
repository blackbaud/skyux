import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyDescriptionListModule, SkyPageSummaryModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import {
  SkySplitViewMessage,
  SkySplitViewMessageType,
  SkySplitViewModule,
} from '@skyux/split-view';

import { Subject } from 'rxjs';

import { Record } from './record';

interface DemoForm {
  approvedAmount: FormControl<number>;
  comments: FormControl<string>;
}

/**
 * @title Page bound split view in a page component with fit layout
 * @docsDemoHidden
 */
@Component({
  selector: 'app-split-view-page-bound-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyAlertModule,
    SkyDescriptionListModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyPageSummaryModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
  ],
})
export class SplitViewPageBoundExampleComponent {
  protected set activeIndex(value: number) {
    this.#_activeIndex = value;
    this.activeRecord = this.items[this.#_activeIndex];
    this.#loadFormGroup(this.activeRecord);
  }

  protected get activeIndex(): number {
    return this.#_activeIndex;
  }

  protected items: Record[] = [
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

  protected activeRecord: Record;
  protected splitViewDemoForm: FormGroup<DemoForm>;
  protected splitViewStream = new Subject<SkySplitViewMessage>();
  protected unapprovedTransaction = true;

  #_activeIndex = 0;

  readonly #confirmSvc = inject(SkyConfirmService);

  constructor() {
    // Start with the first item selected.
    this.activeIndex = 0;
    this.activeRecord = this.items[this.activeIndex];

    this.splitViewDemoForm = new FormGroup({
      approvedAmount: new FormControl(this.activeRecord.approvedAmount, {
        nonNullable: true,
      }),
      comments: new FormControl(this.activeRecord.comments, {
        nonNullable: true,
      }),
    });
  }

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

  #loadFormGroup(record: Record): void {
    this.splitViewDemoForm = new FormGroup({
      approvedAmount: new FormControl(record.approvedAmount, {
        nonNullable: true,
      }),
      comments: new FormControl(record.comments, { nonNullable: true }),
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
        if (closeArgs.action.toLowerCase() === 'yes') {
          this.#saveForm();
        }

        this.#loadWorkspace(index);
      });
  }

  #saveForm(): void {
    this.activeRecord.approvedAmount = parseFloat(
      `${this.splitViewDemoForm.value.approvedAmount ?? 0}`,
    );

    this.activeRecord.comments = this.splitViewDemoForm.value.comments ?? '';

    this.unapprovedTransaction =
      this.items.findIndex((item) => item.amount !== item.approvedAmount) >= 0;

    this.splitViewDemoForm.reset(this.splitViewDemoForm.value);
  }

  #setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace,
    };

    this.splitViewStream.next(message);
  }
}
