import { 
  Component, 
  Input, 
  OnInit, 
  HostBinding
} from '@angular/core';

@Component({
  selector: 'stache-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class StacheColumnComponent implements OnInit {
  @Input()
  public screenSmall: number = 12;

  @HostBinding('class')
  public classnames: string;

  public getClassNames(): string {
    let classnames = [
      'stache-column'
    ];
    classnames.push(`stache-column-sm-${this.screenSmall}`);
    return classnames.join(' ');
  }

  public ngOnInit(): void {
    this.classnames = this.getClassNames();
  }
}
