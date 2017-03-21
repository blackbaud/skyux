import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-breadcrumbs',
  template: `
    <stache-nav navType="breadcrumbs" [routes]="routes"></stache-nav>
  `
})
export class StacheBreadcrumbsComponent {
  @Input()
  public routes;
}
