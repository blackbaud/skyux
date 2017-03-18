import { Component } from '@angular/core';

@Component({
  selector: 'stache-menu-demo',
  templateUrl: './menu-demo.component.html'
})
export class StacheMenuDemoComponent {
  public routes: any[] = [
    {
      path: [],
      fragment: '',
      label: 'My Link'
    }
  ];
  public code: string = `
    <stache-menu></stache-menu>
  `;
}
