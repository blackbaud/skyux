import { Component } from '@angular/core';

@Component({
  selector: 'stache-sidebar-demo',
  templateUrl: './sidebar-demo.component.html'
})
export class StacheMenuDemoComponent {
  public routes = [
    {
      path: [],
      fragment: '',
      label: 'My Link'
    }
  ];
  public code: string = `<stache-sidebar [routes]="routes"></stache-sidebar>`;
}
