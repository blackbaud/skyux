import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
} from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyHelpInlineModule],
  selector: 'sky-chart-heading',
  styleUrl: './chart-heading.scss',
  templateUrl: './chart-heading.html',
})
export class SkyChartHeading {
  public readonly headingLevel = input.required<number>();
  public readonly headingStyle = input.required<number>();
  public readonly headingText = input.required<string>();
  public readonly helpKey = input<string>();
  public readonly helpPopoverContent = input<string | TemplateRef<unknown>>();
  public readonly helpPopoverTitle = input<string>();

  protected readonly headingClass = computed(() => {
    return `sky-font-heading-${this.headingStyle()}`;
  });
}
