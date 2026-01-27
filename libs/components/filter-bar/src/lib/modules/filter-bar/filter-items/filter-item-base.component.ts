import { Component, input, output } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyFilterBarFilterValue } from '../models/filter-bar-filter-value';

/**
 * A filter bar item that is displayed by the other typed filter items.
 * This component contains a common template and styling that gets rendered as part of the consumer DOM.
 * @internal
 */
@Component({
  selector: 'sky-filter-item-base',
  imports: [SkyIconModule],
  templateUrl: './filter-item-base.component.html',
  styleUrls: ['./filter-item-base.component.scss'],
})
export class SkyFilterItemBaseComponent {
  /**
   * A unique identifier for the filter item.
   * @required
   */
  public readonly filterId = input.required<string>();

  /**
   * The value for the filter item.
   */
  public readonly filterValue = input<SkyFilterBarFilterValue>();

  /**
   * The label to display for the filter item.
   */
  public readonly labelText = input.required<string>();

  /**
   * Fires when the user clicks the filter item.
   */
  public readonly itemClick = output<void>();

  protected onClick(): void {
    this.itemClick.emit();
  }
}
