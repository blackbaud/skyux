import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  input,
} from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

/**
 * Displays a list summary item that pairs a label with a formatted value.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-list-summary-item',
  imports: [SkyKeyInfoModule, SkyNumericModule],
  templateUrl: './list-summary-item.component.html',
  styleUrl: './list-summary-item.component.scss',
})
export class SkyListSummaryItemComponent {
  /**
   * Specifies a value to display beside the label in larger, bold text.
   */
  public value = input.required<string | number>();

  /**
   * Specifies a label to display beside the value in smaller, unformatted text.
   */
  public labelText = input.required<string>();

  /**
   * Optional formatting options for numeric values.
   */
  public valueFormat = input<SkyNumericOptions>();

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the list summary item. Clicking the button invokes global help as configured by the application.
   */
  public helpKey = input<string>();

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the list summary item. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
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

    return typeof value === 'number' ? value : undefined;
  });
}
