import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Displays a column within a row of the fluid grid.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classnames()',
  },
  selector: 'sky-column',
  template: '<ng-content />',
  styleUrl: './column.component.scss',
})
export class SkyColumnComponent {
  /**
   * The number of columns (1-12) on extra-small screens (less than 768px). If
   * you do not specify a value, the fluid grid displays the column at the full
   * width of the screen.
   */
  public screenXSmall = input(12, {
    transform: (value) => numberAttribute(value, 12),
  });

  /**
   * The number of columns (1-12) on small screens
   * (768-991px). If you do not specify a value, the column inherits
   * the `screenXSmall` value.
   */
  public screenSmall = input(undefined, { transform: numberAttribute });

  /**
   * The number of columns (1-12) on medium screens
   * (992-1199px). If you do not specify a value, the column inherits
   * the `screenSmall` value.
   */
  public screenMedium = input(undefined, { transform: numberAttribute });

  /**
   * The number of columns (1-12) on large screens
   * (more than 1200px). If you do not specify a value, the column
   * inherits the `screenMedium` value.
   */
  public screenLarge = input(undefined, { transform: numberAttribute });

  protected classnames = computed(() => {
    const classnames = ['sky-column'];

    const screenXSmall = this.screenXSmall();
    const screenSmall = this.screenSmall();
    const screenMedium = this.screenMedium();
    const screenLarge = this.screenLarge();

    if (screenXSmall) {
      classnames.push(`sky-column-xs-${screenXSmall}`);
    }

    if (screenSmall) {
      classnames.push(`sky-column-sm-${screenSmall}`);
    }

    if (screenMedium) {
      classnames.push(`sky-column-md-${screenMedium}`);
    }

    if (screenLarge) {
      classnames.push(`sky-column-lg-${screenLarge}`);
    }

    return classnames.join(' ');
  });
}
