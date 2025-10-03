import { Component } from '@angular/core';
import { SkyListSummaryModule } from '@skyux/lists';

/**
 * @title List summary with basic setup
 */
@Component({
  selector: 'app-lists-list-summary-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyListSummaryModule],
})
export class ListsListSummaryBasicExampleComponent {
  protected summaryItems = [
    {
      label: 'Total records',
      value: 1247,
      helpPopoverContent: 'The total number of records in the current dataset.',
      helpPopoverTitle: 'Total Records Help',
    },
    {
      label: 'Active items',
      value: 892,
      helpPopoverContent:
        'The number of items that are currently active and available for use.',
    },
    {
      label: 'Revenue',
      value: 1234567.89,
      valueFormat: { format: 'currency' },
      helpPopoverContent:
        'Total revenue generated from all active items in the current period.',
    },
    {
      label: 'Average score',
      value: 87.5,
      valueFormat: { format: 'number', digitsInfo: '1.1-1' },
    },
  ];
}
