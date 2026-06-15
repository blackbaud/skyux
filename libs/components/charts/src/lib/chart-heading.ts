import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-heading',
  styleUrl: './chart-heading.scss',
  templateUrl: './chart-heading.html',
})
export class SkyChartHeading {
  public readonly headingHidden = input.required<boolean>();
  public readonly headingId = input.required<string>();
  public readonly headingLevel = input.required<number>();
  public readonly headingStyle = input.required<number>();
  public readonly headingText = input.required<string>();

  protected readonly headingClass = computed(() => {
    return `sky-font-heading-${this.headingStyle()}`;
  });
}
