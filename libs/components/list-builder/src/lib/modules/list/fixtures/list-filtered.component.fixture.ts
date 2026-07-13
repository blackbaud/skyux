import { Component, inject, input, ViewChild } from '@angular/core';

import { ListFilterModel } from '../../list-filters/filter.model';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-filtered.component.fixture.html',
  standalone: false,
})
export class ListFilteredTestComponent {
  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true,
  })
  public list: SkyListComponent;

  public listFilters = input<ListFilterModel[]>([]);

  public appliedFilters: ListFilterModel[] = [];

  public readonly items: any = inject('items' as any);

  public filtersChangeFunction(newFilters: ListFilterModel[]) {
    this.appliedFilters = newFilters;
  }
}
