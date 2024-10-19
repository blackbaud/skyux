import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies the summary information to display.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-summary-action-bar-summary',
  standalone: true,
  templateUrl: './summary-action-bar-summary.component.html',
})
export class SkySummaryActionBarSummaryComponent {}
