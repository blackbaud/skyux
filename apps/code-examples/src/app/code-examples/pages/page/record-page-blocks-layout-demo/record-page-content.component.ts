import { Component } from '@angular/core';

@Component({
  selector: 'app-record-page-content',
  templateUrl: './record-page-content.component.html',
  styleUrls: ['./record-page-content.component.scss'],
})
export class RecordPageContentComponent {
  public recordDetails = [
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

  public actualPayments = [
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

  public projectedPayments = [
    {
      category: 'Amount',
      value: '$0',
    },
    {
      category: 'Line items',
      value: 0,
    },
  ];

  public recentActivity = [
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
