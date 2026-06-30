import { Component, signal } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-dynamic.component.fixture.html',
  standalone: false,
})
export class GridDynamicTestComponent {
  public data: any[];
  public gridColumns = signal<any[]>([
    { id: 1, field: 'name', heading: 'Name Initial' },
    { id: 2, field: 'email', heading: 'Email Initial' },
  ]);

  constructor() {
    this.data = [
      { id: 1, name: 'Windstorm', email: 'windstorm@gmail.com' },
      { id: 2, name: 'Bombastic', email: 'Bombastic@gmail.com' },
      { id: 3, name: 'Magenta', email: 'magenta@gmail.com' },
      { id: 4, name: 'Tornado', email: 'tornado@gmail.com' },
    ];
  }

  public changeColumns() {
    this.gridColumns.set([
      { id: 1, field: 'name', heading: 'Name' },
      { id: 2, field: 'email', heading: 'Email' },
    ]);
  }
}
