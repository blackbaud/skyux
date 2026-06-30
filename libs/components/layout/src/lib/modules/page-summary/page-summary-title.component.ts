import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a title to identify the page content.
 * @deprecated
 */
@Component({
  selector: 'sky-page-summary-title',
  templateUrl: './page-summary-title.component.html',
  styleUrls: ['./page-summary-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
/* istanbul ignore next */
/* Code coverage having problems with no statements in classes */
export class SkyPageSummaryTitleComponent {}
