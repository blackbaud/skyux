import {
  Component,
  ViewChild,
  Inject
} from '@angular/core';

import {
  ListFilterModel
} from '../state';

import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-filtered.component.fixture.html'
})
export class ListFilteredTestComponent {
  @ViewChild(SkyListComponent)
  public list: SkyListComponent;

  public listFilters: Array<ListFilterModel> = [];

  public appliedFilters: Array<ListFilterModel> = [];

  constructor(@Inject('items') public items: any) {
  }

  public filtersChangeFunction(newFilters: Array<ListFilterModel>) {
    this.appliedFilters = newFilters;
  }

}
