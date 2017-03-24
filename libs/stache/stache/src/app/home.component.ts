import { Component } from '@angular/core';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public routes: any[] = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Learn',
      path: '/learn'
    },
    {
      name: 'Getting Started',
      path: '/learn/getting-started'
    }
  ];
}
