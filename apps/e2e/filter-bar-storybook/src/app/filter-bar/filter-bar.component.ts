import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyFilterBarFilterItem, SkyFilterBarModule } from '@skyux/filter-bar';
import {
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
} from '@skyux/lookup';

import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, SkyFilterBarModule],
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  protected filters: SkyFilterBarFilterItem[] = [
    {
      id: '1',
      filterValue: { value: 'Yes' },
    },
    { id: '2' },
  ];

  protected summaryItems = [
    { value: 1, label: 'Summary 1', helpPopoverContent: 'test' },
    { value: 2, label: 'Summary 2', valueFormat: { format: 'currency' } },
  ];

  protected searchFn: (
    args: SkySelectionModalSearchArgs,
  ) => Observable<SkySelectionModalSearchResult> | undefined = () => undefined;
}
