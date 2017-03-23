import { Component, Input } from '@angular/core';

import { StacheNav } from './nav';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class StacheBreadcrumbsComponent implements StacheNav {
  @Input()
  public routes = [{
    name: 'Home',
    path: ['/']
  }, {
    name: 'Components',
    path: ['/', 'components']
  }];
}
