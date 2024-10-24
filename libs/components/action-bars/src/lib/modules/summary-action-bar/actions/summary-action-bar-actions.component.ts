import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Contains actions for the `sky-summary-action-bar` component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-summary-action-bar-actions',
  standalone: true,
  styleUrls: ['./summary-action-bar-actions.component.scss'],
  templateUrl: './summary-action-bar-actions.component.html',
})
export class SkySummaryActionBarActionsComponent {}
