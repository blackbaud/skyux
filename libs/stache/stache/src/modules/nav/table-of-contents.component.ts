import { Component, Input } from '@angular/core';

import { StacheNavLink } from './nav-link';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class StacheTableOfContentsComponent {
  @Input()
  public routes: StacheNavLink[];
}
