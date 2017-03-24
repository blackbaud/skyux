import { Component, Input } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class StacheBreadcrumbsComponent implements StacheNav {
  @Input()
  public routes: StacheNavLink[];
}
