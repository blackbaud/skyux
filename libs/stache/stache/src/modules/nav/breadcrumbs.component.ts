import { Component, Input } from '@angular/core';

import { StacheNav } from './nav';

@Component({
  selector: 'stache-breadcrumbs',
  template: `
    <stache-nav navType="breadcrumbs" [routes]="routes"></stache-nav>
  `
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
