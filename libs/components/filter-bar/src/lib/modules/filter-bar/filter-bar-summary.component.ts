import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * A summary bar can be added to a filter bar.
 * It contains one or more key summary items for the data the filter bar controls.
 */
@Component({
  selector: 'sky-filter-bar-summary',
  imports: [CommonModule],
  templateUrl: './filter-bar-summary.component.html',
  styleUrl: './filter-bar-summary.component.scss',
})
export class SkyFilterBarSummaryComponent {}
