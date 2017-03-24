import { Component } from '@angular/core';

@Component({
  selector: 'stache-table-of-contents-demo',
  templateUrl: './table-of-contents-demo.component.html'
})
export class StacheTableOfContentsDemoComponent {
  public routes: any[] = [
    {
      name: 'Overview',
      path: '/'
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
