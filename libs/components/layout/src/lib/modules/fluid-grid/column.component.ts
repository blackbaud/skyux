import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Displays a column within a row of the fluid grid.
 */
@Component({
  selector: 'sky-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyColumnComponent implements OnInit, OnChanges {
  /**
   * Specifies the number of columns (1-12) to use on extra-small screens
   * (less than 768px). If you do not specify a value, the fluid grid displays
   * the column at the full width of the screen.
   * @default 12
   */
  @Input()
  public screenXSmall: number;

  /**
   * Specifies the number of columns (1-12) to use on small screens
   * (768-991px). If you do not specify a value, the column inherits
   * the `screenXSmall` value.
   */
  @Input()
  public screenSmall: number;

  /**
   * Specifies the number of columns (1-12) to use on medium screens
   * (992-1199px). If you do not specify a value, the column inherits
   * the `screenSmall` value.
   */
  @Input()
  public screenMedium: number;

  /**
   * Specifies the number of columns (1-12) to use on large screens
   * (more than 1200px). If you do not specify a value, the column
   * inherits the `screenMedium` value.
   */
  @Input()
  public screenLarge: number;

  @HostBinding('class')
  public classnames: string;

  public ngOnChanges(changes: SimpleChanges) {
    /* istanbul ignore else */
    if (
      changes.screenXSmall ||
      changes.screenSmall ||
      changes.screenMedium ||
      changes.screenLarge
    ) {
      this.classnames = this.getClassNames();
    }
  }

  public getClassNames(): string {
    const classnames = ['sky-column'];

    if (this.screenXSmall) {
      classnames.push(`sky-column-xs-${this.screenXSmall}`);
    }

    if (this.screenSmall) {
      classnames.push(`sky-column-sm-${this.screenSmall}`);
    }

    if (this.screenMedium) {
      classnames.push(`sky-column-md-${this.screenMedium}`);
    }

    if (this.screenLarge) {
      classnames.push(`sky-column-lg-${this.screenLarge}`);
    }

    return classnames.join(' ');
  }

  public ngOnInit(): void {
    this.classnames = this.getClassNames();
  }
}
