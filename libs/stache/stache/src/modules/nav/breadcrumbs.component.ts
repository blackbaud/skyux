import { Component, Input } from '@angular/core';

import { StacheNav } from './nav';
import { StacheNavLink } from './nav-link';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class StacheBreadcrumbsComponent implements StacheNav {
  @Input()
  public routes: StacheNavLink[];
}
