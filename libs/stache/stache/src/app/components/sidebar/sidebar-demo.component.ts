import { Component } from '@angular/core';

@Component({
  selector: 'stache-sidebar-demo',
  templateUrl: './sidebar-demo.component.html'
})
export class StacheSidebarDemoComponent {
  public routes: any[] = [
    {
      name: 'Overview',
      path: '/components/sidebar'
    },
    {
      name: 'Installation',
      path: '/'
    },
    {
      name: 'How to use',
      path: '/'
    }
  ];
}
