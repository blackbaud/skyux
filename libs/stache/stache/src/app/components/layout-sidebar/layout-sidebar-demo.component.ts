import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stache-layout-sidebar-demo',
  templateUrl: './layout-sidebar-demo.component.html'
})
export class StacheLayoutSidebarDemoComponent implements OnInit {
  public routes: any[] = [
    {
      name: 'Sample Link 1',
      path: '/sample-link-1'
    },
    {
      name: 'Sample Link 2',
      path: '/sample-link-2'
    },
    {
      name: 'Sample Link 3',
      path: '/sample-link-3'
    }
  ];
  public ngOnInit(): void { }
}
