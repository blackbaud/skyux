import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyFilterBarFilterItem, SkyFilterBarModule } from '@skyux/filter-bar';

@Component({
  imports: [CommonModule, SkyFilterBarModule],
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  protected appliedFilters: SkyFilterBarFilterItem[] = [
    {
      filterId: '1',
      filterValue: { value: 'Yes' },
    },
    { filterId: '2' },
  ];

  protected modalComponent = class {};
}
