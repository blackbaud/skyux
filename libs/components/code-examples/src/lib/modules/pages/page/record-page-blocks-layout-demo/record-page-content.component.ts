import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyKeyInfoModule } from '@skyux/indicators';
import {
  SkyBoxModule,
  SkyDescriptionListModule,
  SkyFluidGridModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';

@Component({
  selector: 'app-record-page-content',
  templateUrl: './record-page-content.component.html',
  styleUrls: ['./record-page-content.component.scss'],
  imports: [
    CommonModule,
    SkyBoxModule,
    SkyDescriptionListModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyRepeaterModule,
  ],
})
export class RecordPageContentComponent {
  protected recordDetails = [
    {
      detail: 'Designation',
      info: 'General operating',
    },
    {
      detail: 'Source',
      info: 'Online donation form',
    },
    {
      detail: 'Status',
      info: 'Active',
    },
    {
      detail: 'Due date',
      info: '12/12/2023',
    },
    {
      detail: 'Create date',
      info: '01/05/2023',
    },
    {
      detail: 'Frequency',
      info: 'Quarterly',
    },
  ];

  protected actualPayments = [
    {
      category: 'Amount',
      value: '$845.00',
    },
    {
      category: 'Assigned',
      value: '$800.00',
    },
    {
      category: 'Applied',
      value: '$800.00',
    },
    {
      category: 'Payments',
      value: 25,
    },
  ];

  protected projectedPayments = [
    {
      category: 'Amount',
      value: '$0',
    },
    {
      category: 'Line items',
      value: 0,
    },
  ];

  protected recentActivity = [
    {
      activity: '$250.00 payment processed successfully.',
      date: '07/01/2023 12:02 am',
    },
    {
      activity: '$150.00 payment processed successfully.',
      date: '06/15/2023 12:02 am',
    },
    {
      activity: '$250.00 payment processed successfully.',
      date: '04/01/2023 12:02 am',
    },
  ];
}
