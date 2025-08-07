import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Specifies a filter that was applied.
 */
@Component({
  selector: 'sky-filter-summary-item',
  styleUrls: ['./filter-summary-item.component.scss'],
  templateUrl: './filter-summary-item.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],

  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyFilterSummaryItemComponent {
  /**
   * Whether the filter summary item has a close button.
   */
  @Input()
  public get dismissible(): boolean {
    return this.#_dismissible;
  }

  public set dismissible(value: boolean | undefined) {
    this.#_dismissible = value !== false;
  }

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

  #_dismissible = true;

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
