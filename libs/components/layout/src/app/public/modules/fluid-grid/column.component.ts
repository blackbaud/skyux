import {
  Component,
  HostBinding,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'sky-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class SkyColumnComponent implements OnInit, OnChanges {

  @Input()
  public screenXSmall: number;

  @Input()
  public screenSmall: number;

  @Input()
  public screenMedium: number;

  @Input()
  public screenLarge: number;

  @HostBinding('class')
  private classnames: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.screenXSmall || changes.screenSmall || changes.screenMedium || changes.screenLarge) {
      this.classnames = this.getClassNames();
    }
  }

  public getClassNames(): string {
    let classnames = [
      'sky-column'
    ];

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
