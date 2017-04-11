import {
  Component,
  HostBinding,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'stache-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class StacheColumnComponent implements OnInit {
  @Input()
  public screenSmall: number;

  @Input()
  public screenMedium: number;

  @Input()
  public screenLarge: number;

  @HostBinding('class')
  private classnames: string;

  public getClassNames(): string {
    let classnames = [
      'stache-column'
    ];

    if (this.screenSmall) {
      classnames.push(`stache-column-sm-${this.screenSmall}`);
    }

    if (this.screenMedium) {
      classnames.push(`stache-column-md-${this.screenMedium}`);
    }

    if (this.screenLarge) {
      classnames.push(`stache-column-lg-${this.screenLarge}`);
    }

    return classnames.join(' ');
  }

  public ngOnInit(): void {
    this.classnames = this.getClassNames();
  }
}
