import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Displays a primary button.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-summary-action-bar-primary-action',
  styleUrls: ['./summary-action-bar-primary-action.component.scss'],
  templateUrl: './summary-action-bar-primary-action.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkySummaryActionBarPrimaryActionComponent {
  /**
   * Whether to disable the primary action.
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
