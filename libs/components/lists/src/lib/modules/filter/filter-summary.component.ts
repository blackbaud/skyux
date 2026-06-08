import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a wrapper for the filters that were applied.
 * @deprecated Use [filter bar](https://developer.blackbaud.com/skyux/components/filter-bar) instead.
 */
@Component({
  selector: 'sky-filter-summary',
  styleUrls: ['./filter-summary.component.scss'],
  templateUrl: './filter-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyFilterSummaryComponent {}
