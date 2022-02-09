import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The page summary provides a section at the top of the page
 * to summarize what a user should expect to find or learn on the page.
 * @example
 * ```
 * <sky-docs-demo-page-summary>
 *   Page summary here.
 * </sky-docs-demo-page-summary>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-page-summary',
  templateUrl: './demo-page-summary.component.html',
  styleUrls: ['./demo-page-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsDemoPageSummaryComponent {}
