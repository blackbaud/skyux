import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  SkyDocsAnatomyItemComponent
} from './anatomy-item.component';

@Component({
  selector: 'sky-docs-anatomy',
  templateUrl: './anatomy.component.html',
  styleUrls: ['./anatomy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsAnatomyComponent implements AfterContentInit {

  @Input()
  public imagePath: string;

  @ContentChildren(SkyDocsAnatomyItemComponent)
  private anatomyItems: QueryList<SkyDocsAnatomyItemComponent>;

  public ngAfterContentInit(): void {
    this.anatomyItems.forEach((item, i) => {
      item.marker = (i + 1).toString();
    });
  }

}
