import { Component, TemplateRef, computed, input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

/**
 * Displays a single summary statistic with a label and formatted value.
 */
@Component({
  selector: 'sky-list-summary-item',
  imports: [SkyKeyInfoModule, SkyNumericModule],
  templateUrl: './list-summary-item.component.html',
  styleUrl: './list-summary-item.component.scss',
})
export class SkyListSummaryItemComponent {
  /**
   * Specifies a value to display in larger, bold text.
   */
  public value = input.required<string | number>();

  /**
   * Specifies a label to display in smaller text beside the value.
   */
  public label = input.required<string>();

  /**
   * Optional formatting options for numeric values.
   */
  public valueFormat = input<SkyNumericOptions>();

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the key info. Clicking the button invokes global help as configured by the application.
   */
  public helpKey = input<string>();

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the key info. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
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
