import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { SkySelectionModalOpenArgs } from '@skyux/lookup';

import { SkyFilterBarFilterModalConfig } from './models/filter-bar-filter-modal-config';

/**
 * A component used to define a filter bar item configuration.
 */
@Component({
  selector: 'sky-filter-bar-item',
  imports: [CommonModule],
  template: '',
})
export class SkyFilterBarItemComponent {
  /**
   * A unique identifier for the filter.
   */
  public filterId = input.required<string>();

  /**
   * The name of the filter displayed in the text label.
   */
  public labelText = input.required<string>();

  /**
   * The configuration options for showing a custom filter modal.
   */
  public filterModalConfig = input<SkyFilterBarFilterModalConfig>();

  /**
   * The configuration options for showing a `SkySelectionModal`.
   */
  public filterSelectionModalConfig = input<SkySelectionModalOpenArgs>();
}
