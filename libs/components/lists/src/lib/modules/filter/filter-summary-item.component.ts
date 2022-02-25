import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Specifies a filter that was applied.
 */
@Component({
  selector: 'sky-filter-summary-item',
  styleUrls: ['./filter-summary-item.component.scss'],
  templateUrl: './filter-summary-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFilterSummaryItemComponent {
  /**
   * Indicates whether the filter summary item has a close button.
   */
  @Input()
  public dismissible = true;

  /**
   * Fires when the summary item close button is selected.
   */
  @Output()
  public dismiss = new EventEmitter<void>();

  /**
   * Fires when the summary item is selected.
   */
  @Output()
  public itemClick = new EventEmitter<void>();

  public onItemDismiss(): void {
    this.dismiss.emit();
  }

  public onItemClick(): void {
    this.itemClick.emit();
  }

  public onItemKeypress(): void {
    this.itemClick.emit();
  }
}
