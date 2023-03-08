import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
  selector: 'sky-summary-action-bar-primary-action',
  templateUrl: './summary-action-bar-primary-action.component.html',
  styleUrls: ['./summary-action-bar-primary-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySummaryActionBarPrimaryActionComponent {
  /**
   * Whether to disable the primary action.
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
   * Fires when users select the primary action.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  #_disabled = false;

  public onButtonClicked(): void {
    this.actionClick.emit();
  }
}
