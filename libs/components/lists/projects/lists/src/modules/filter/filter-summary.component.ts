import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a wrapper for the filters that were applied.
 */
@Component({
  selector: 'sky-filter-summary',
  styleUrls: ['./filter-summary.component.scss'],
  templateUrl: './filter-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFilterSummaryComponent {}
