import { Component, TemplateRef, computed, input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

@Component({
  selector: 'sky-list-summary-item',
  imports: [SkyKeyInfoModule, SkyNumericModule],
  templateUrl: './list-summary-item.component.html',
  styleUrl: './list-summary-item.component.scss',
})
export class SkyListSummaryItemComponent {
  public value = input.required<string | number>();
  public label = input.required<string>();
  public valueFormat = input<SkyNumericOptions>();
  public helpKey = input<string>();
  public helpPopoverContent = input<string | TemplateRef<unknown>>();
  public helpPopoverTitle = input<string>();

  protected numericValue = computed((): number | undefined => {
    const value = this.value();

    if (typeof value === 'number') {
      return value;
    }
    return undefined;
  });
}
