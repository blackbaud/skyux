import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { SkyFilterModule } from '@skyux/lists';

@Component({
  selector: 'app-filter-visual',
  templateUrl: './filter-visual.component.html',
})
export class FilterVisualComponent {
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

@NgModule({
  imports: [CommonModule, SkyFilterModule],
  declarations: [FilterVisualComponent],
  exports: [FilterVisualComponent],
})
export class FilterVisualComponentModule {}
