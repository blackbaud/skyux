import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html'
})
export class AppNavComponent {
  public nav = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Tutorial Demo',
      path: '/tutorial-demo'
    },
    {
      name: 'Route Metadata Demo',
      path: '/route-metadata-demo'
    }
  ];
}
