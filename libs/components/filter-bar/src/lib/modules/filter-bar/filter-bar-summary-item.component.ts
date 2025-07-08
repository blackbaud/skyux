import { CommonModule } from '@angular/common';
import { Component, TemplateRef, computed, input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

@Component({
  selector: 'sky-filter-bar-summary-item',
  imports: [CommonModule, SkyKeyInfoModule, SkyNumericModule],
  templateUrl: './filter-bar-summary-item.component.html',
  styleUrl: './filter-bar-summary-item.component.scss',
})
export class SkyFilterBarSummaryItemComponent {
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
