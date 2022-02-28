import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies the summary information to display.
 */
@Component({
  selector: 'sky-summary-action-bar-summary',
  templateUrl: './summary-action-bar-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySummaryActionBarSummaryComponent {}
