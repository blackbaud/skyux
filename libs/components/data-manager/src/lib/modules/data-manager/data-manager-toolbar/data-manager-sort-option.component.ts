import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';

/**
 * Declares a single sort option for `SkyDataManagerToolbarComponent` to render, as
 * an alternative to `SkyDataManagerConfig.sortOptions` for the signal-based toolbar
 * API. Add one `sky-data-manager-sort-option` per option.
 * @preview
 */
@Component({
  selector: 'sky-data-manager-sort-option',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataManagerSortOptionComponent {
  /**
   * A unique ID for the sort option.
   * @preview
   */
  public readonly id = input.required<string>();

  /**
   * The data property to sort by.
   * @preview
   */
  public readonly propertyName = input.required<string>();

  /**
   * The label to display in the sort dropdown.
   * @preview
   */
  public readonly label = input.required<string>();

  /**
   * Whether to apply the sort in descending order.
   * @default false
   * @preview
   */
  public readonly descending = input<boolean>(false);

  /**
   * Returns the `SkyDataManagerSortOption` equivalent of this component's inputs.
   * @preview
   */
  public toSortOption(): SkyDataManagerSortOption {
    return {
      id: this.id(),
      propertyName: this.propertyName(),
      label: this.label(),
      descending: this.descending(),
    };
  }
}
