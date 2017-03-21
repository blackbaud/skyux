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
        label: 'Home',
        path: ['']
      },
      {
        label: 'Parent',
        path: ['']
      },
      {
        label: 'Child',
        path: ['']
      }
    ];
  }
}
