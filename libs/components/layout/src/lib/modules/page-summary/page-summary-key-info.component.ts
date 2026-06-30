import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Highlights important information about a page in the key information section of the
 * page summary.
 * @deprecated
 */
@Component({
  selector: 'sky-page-summary-key-info',
  templateUrl: './page-summary-key-info.component.html',
  styleUrls: ['./page-summary-key-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyPageSummaryKeyInfoComponent {}
