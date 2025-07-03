import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { SkyNumericModule } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { SkyFilterBarSummaryItem } from './models/filter-bar-summary-item';

@Component({
  selector: 'sky-filter-bar-summary',
  imports: [CommonModule, SkyKeyInfoModule, SkyNumericModule],
  templateUrl: './filter-bar-summary.component.html',
  styleUrl: './filter-bar-summary.component.scss',
})
export class SkyFilterBarSummaryComponent {
  public summaryItems = input.required<SkyFilterBarSummaryItem[]>();
}
