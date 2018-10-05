import { Component } from '@angular/core';

@Component({
  selector: 'filter-visual',
  templateUrl: './filter-visual.component.html'
})
export class FilterVisualComponent {
  public filtersActive: boolean = false;

  public appliedFilters: Array<any> = [
    {
      label: 'hide orange',
      dismissible: false
    },
    {
      label: 'berry fruit type',
      dismissible: true
    }
  ];
}
