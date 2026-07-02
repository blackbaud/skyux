import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays content in the arbitrary section of the page summary.
 * @deprecated
 */
@Component({
  selector: 'sky-page-summary-content',
  templateUrl: './page-summary-content.component.html',
  styleUrls: ['./page-summary-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
/* istanbul ignore next */
/* Code coverage having problems with no statements in classes */
export class SkyPageSummaryContentComponent {}
