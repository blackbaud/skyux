import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class StacheBreadcrumbsComponent {
  @Input()
  public routes: any[];

  public constructor() {}
}
