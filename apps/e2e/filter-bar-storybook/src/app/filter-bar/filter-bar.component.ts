import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyFilterBarFilterItem, SkyFilterBarModule } from '@skyux/filter-bar';

@Component({
  standalone: true,
  imports: [CommonModule, SkyFilterBarModule],
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  protected filters: SkyFilterBarFilterItem[] = [
    {
      id: '1',
      filterValue: { value: 'Yes' },
    },
    { id: '2' },
  ];

  protected modalConfig = { modalComponent: class {} };
}
