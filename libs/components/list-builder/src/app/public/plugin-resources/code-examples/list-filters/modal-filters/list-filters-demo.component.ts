import {
  Component
} from '@angular/core';

import {
  ListFilterModel
} from '@skyux/list-builder';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  of
} from 'rxjs';

import {
  ListFilterDemoModalComponent
} from './list-filters-demo-modal.component';

import {
  ListFiltersDemoModalContext
} from './list-filters-demo-modal-context';

@Component({
  selector: 'app-list-filters-demo',
  templateUrl: './list-filters-demo.component.html'
})
export class ListFiltersDemoComponent {

  public items = of([
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

  public listFilters: ListFilterModel[] = [];

  public modalFilters: ListFilterModel[] = [];

  constructor(
    private modalService: SkyModalService
  ) { }

  public openFilterModal(): void {
    const instance = this.modalService.open(ListFilterDemoModalComponent, [{
      provide: ListFiltersDemoModalContext,
      useValue: {
        appliedFilters: this.modalFilters
      }
    }]);

    instance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        this.listFilters = result.data.slice();
      }
    });
  }
}
