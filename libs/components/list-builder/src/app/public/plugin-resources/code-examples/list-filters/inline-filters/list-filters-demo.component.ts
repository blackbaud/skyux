import {
  Component
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  Observable,
  of
} from 'rxjs';

@Component({
  selector: 'app-list-filters-demo',
  templateUrl: './list-filters-demo.component.html'
})
export class ListFiltersDemoComponent {

  public items: Observable<any> = of([
    {
      id: 0,
      name: 'Orange',
      description: 'A round, orange fruit.',
      type: 'citrus',
      color: 'orange'
    },
    {
      id: 1,
      name: 'Mango',
      description: 'Delicious in smoothies, but don\'t eat the skin.',
      type: 'other',
      color: 'orange'
    },
    {
      id: 2,
      name: 'Lime',
      description: 'A sour, green fruit used in many drinks.',
      type: 'citrus',
      color: 'green'
    },
    {
      id: 3,
      name: 'Strawberry',
      description: 'A red fruit that goes well with shortcake.',
      type: 'berry',
      color: 'red'
    },
    {
      id: 4,
      name: 'Blueberry',
      description: 'A small, blue fruit often found in muffins.',
      type: 'berry',
      color: 'blue'
    }
  ]);

  public fruitTypeFilterFunction(item: ListItemModel, filterValue: any): boolean {
    return filterValue === 'any' || filterValue === item.data.type;
  }

  public hideOrangeFilterFunction(item: ListItemModel, filterValue: any): boolean {
    return !filterValue || (filterValue && item.data.color !== 'orange');
  }
}
