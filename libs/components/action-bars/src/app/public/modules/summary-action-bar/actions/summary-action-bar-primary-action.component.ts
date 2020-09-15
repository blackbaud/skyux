import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

/**
 * Displays a primary button.
 */
@Component({
  selector: 'sky-summary-action-bar-primary-action',
  templateUrl: './summary-action-bar-primary-action.component.html',
  styleUrls: ['./summary-action-bar-primary-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySummaryActionBarPrimaryActionComponent {

/**
 * Indicates whether to disable the primary action.
 * @default false
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
