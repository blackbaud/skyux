import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SkyDataManagerDockType,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import {
  SkySplitViewMessage,
  SkySplitViewMessageType,
} from '@skyux/split-view';

import { Subject } from 'rxjs';

import { Record } from './record';

interface DemoForm {
  approvedAmount: FormControl<number>;
  comments: FormControl<string>;
}

@Component({
  selector: 'app-split-view-data-manager',
  templateUrl: './split-view-data-manager.component.html',
  standalone: false,
})
export class SplitViewDataManagerComponent implements OnInit {
  protected set activeIndex(value: number) {
    this.#_activeIndex = value;
    this.activeRecord = this.items[this.#_activeIndex];
    this.#loadFormGroup(this.activeRecord);
  }

  protected get activeIndex(): number {
    return this.#_activeIndex;
  }

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

  protected activeRecord: Record;
  protected splitViewDemoForm: FormGroup<DemoForm>;
  protected splitViewStream = new Subject<SkySplitViewMessage>();

  protected dock: SkyDataManagerDockType = 'fill';

  #splitViewConfig: SkyDataViewConfig = {
    id: 'dataManagerView',
    name: 'Split View Data Manager View',
    sortEnabled: true,
    searchEnabled: true,
  };

  #_activeIndex = 0;

  readonly #dataManagerService = inject(SkyDataManagerService);
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

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
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
    this.#dataManagerService.initDataView(this.#splitViewConfig);
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
    this.activeRecord.approvedAmount =
      this.splitViewDemoForm.value.approvedAmount ?? 0;
    this.activeRecord.comments = this.splitViewDemoForm.value.comments ?? '';

    this.splitViewDemoForm.reset(this.splitViewDemoForm.value);
  }

  #setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace,
    };
    this.splitViewStream.next(message);
  }
}
