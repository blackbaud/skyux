import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import {
  SkySplitViewMessage,
  SkySplitViewMessageType,
  SkySplitViewModule,
} from '@skyux/split-view';

import { Subject } from 'rxjs';

import { LinksComponent } from '../../../shared/links/links.component';

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
  selector: 'app-fit-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyDescriptionListModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
    LinksComponent,
  ],
  templateUrl: './fit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FitPageComponent {
  public readonly showLinks = input<boolean>(false);

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
