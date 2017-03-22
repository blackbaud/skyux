import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stache-breadcrumbs-demo',
  templateUrl: './breadcrumbs-demo.component.html'
})
export class StacheBreadcrumbsDemoComponent implements OnInit {
  public routes;

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
