import { Component } from '@angular/core';

import { delay, of } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  standalone: false,
})
export class FilterComponent {
  public readonly ready = of(true).pipe(delay(300));

  public filtersActive = false;

  public appliedFilters = [
    {
      label: 'hide orange',
      dismissible: false,
    },
    {
      label: 'berry fruit type',
      dismissible: true,
    },
  ];

  public lotsOfFilters = [
    {
      label: 'Really long filter 1',
      dismissible: false,
    },
    {
      label: 'Really long filter 2',
      dismissible: true,
    },
    {
      label: 'Really long filter 3',
      dismissible: true,
    },
    {
      label: 'Really long filter 4',
      dismissible: true,
    },
    {
      label: 'Really long filter 5',
      dismissible: true,
    },
    {
      label: 'Really long filter 6',
      dismissible: true,
    },
    {
      label: 'Really long filter 7',
      dismissible: true,
    },
    {
      label: 'Really long filter 8',
      dismissible: true,
    },
    {
      label: 'Really long filter 9',
      dismissible: true,
    },
  ];
}
