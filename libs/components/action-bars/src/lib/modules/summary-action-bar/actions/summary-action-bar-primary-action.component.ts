import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Displays a primary button.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-summary-action-bar-primary-action',
  standalone: true,
  styleUrls: ['./summary-action-bar-primary-action.component.scss'],
  templateUrl: './summary-action-bar-primary-action.component.html',
})
export class SkySummaryActionBarPrimaryActionComponent {
  /**
   * Whether to disable the primary action.
   */
  @Input()
  public disabled = false;

  /**
   * Fires when users select the primary action.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  public onButtonClicked(): void {
    this.actionClick.emit();
  }
}
