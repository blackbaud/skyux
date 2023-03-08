import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
  selector: 'sky-summary-action-bar-cancel',
  templateUrl: './summary-action-bar-cancel.component.html',
  styleUrls: ['./summary-action-bar-cancel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySummaryActionBarCancelComponent {
  /**
   * Whether to disable the cancel action.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = coerceBooleanProperty(value);
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Fires when users select the cancel action.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  #_disabled = false;

  public onCancelClicked(): void {
    this.actionClick.emit();
  }
}
