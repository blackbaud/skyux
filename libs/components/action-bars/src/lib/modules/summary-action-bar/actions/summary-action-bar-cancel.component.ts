import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Displays a cancel action.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-summary-action-bar-cancel',
  standalone: true,
  styleUrls: ['./summary-action-bar-cancel.component.scss'],
  templateUrl: './summary-action-bar-cancel.component.html',
})
export class SkySummaryActionBarCancelComponent {
  /**
   * Whether to disable the cancel action.
   */
  @Input()
  public disabled = false;

  /**
   * Fires when users select the cancel action.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  public onCancelClicked(): void {
    this.actionClick.emit();
  }
}
