import { CommonModule } from '@angular/common';
import { Component, TemplateRef, computed, input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

/**
 * A summary item to be displayed on a filter bar summary component.
 * Items are displayed as a formatted [key info](https://developer.blackbaud.com/skyux/components/key-info) with an optional help key.
 */
@Component({
  selector: 'sky-filter-bar-summary-item',
  imports: [CommonModule, SkyKeyInfoModule, SkyNumericModule],
  templateUrl: './filter-bar-summary-item.component.html',
  styleUrl: './filter-bar-summary-item.component.scss',
})
export class SkyFilterBarSummaryItemComponent {
  /**
   * The value of the summary item. Can be a raw numerical value or a preformatted string.
   * @required
   */
  public value = input.required<string | number>();

  /**
   * The label of the summary item.
   * @required
   */
  public label = input.required<string>();

  /**
   * A numerical formatter to be applied to the summary item value.
   */
  public valueFormat = input<SkyNumericOptions>();

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the summary item. Clicking the button invokes global help as configured by the application.
   */
  public helpKey = input<string>();

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the summary item. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  public helpPopoverContent = input<string | TemplateRef<unknown>>();

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  public helpPopoverTitle = input<string>();

  protected numericValue = computed((): number | undefined => {
    const value = this.value();

    if (typeof value === 'number') {
      return value;
    }
    return undefined;
  });
}
