import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyNumericOptions } from '@skyux/core';
import { SkyListSummaryModule } from '@skyux/lists';

@Component({
  imports: [CommonModule, SkyListSummaryModule],
  selector: 'app-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss'],
})
export class ListSummaryComponent {
  protected summaryItems: {
    value: number;
    labelText: string;
    helpPopoverContent?: string;
    valueFormat?: SkyNumericOptions;
  }[] = [
    { value: 1, labelText: 'Record', helpPopoverContent: 'test' },
    {
      value: 2,
      labelText: 'Average donation',
      valueFormat: { format: 'currency' },
    },
    {
      value: 3e4,
      labelText: 'External contributions',
      valueFormat: {
        format: 'currency',
        truncate: true,
        currencyDisplay: 'code',
      },
    },
    {
      value: 9287847424,
      labelText: 'Whales yet to be saved',
      valueFormat: {
        truncate: false,
      },
    },
    {
      value: 67,
      labelText: 'TikTok videos',
    },
    {
      value: 1999,
      labelText: 'Video games',
    },
  ];
}
