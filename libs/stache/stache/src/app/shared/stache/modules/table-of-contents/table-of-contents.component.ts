import { Component, Input } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class StacheTableOfContentsComponent implements StacheNav {
  @Input()
  public routes: StacheNavLink[];
}
