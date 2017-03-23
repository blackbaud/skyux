import { Component, OnInit } from '@angular/core';
import { StacheNavLink } from '../../../modules/nav/nav-link';

@Component({
  selector: 'stache-breadcrumbs-demo',
  templateUrl: './breadcrumbs-demo.component.html'
})
export class StacheBreadcrumbsDemoComponent implements OnInit {
  public routes: StacheNavLink[];

  public ngOnInit(): void {
    this.routes = [
      {
        name: 'Home',
        path: ['/']
      },
      {
        name: 'Parent',
        path: ['/', 'parent']
      },
      {
        name: 'Child',
        path: ['/', 'parent', 'child']
      }
    ];
  }
}
