import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A header to display above the progress indicator.
 */
@Component({
  selector: 'sky-progress-indicator-title',
  templateUrl: './progress-indicator-title.component.html',
  styleUrls: ['./progress-indicator-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyProgressIndicatorTitleComponent {}
