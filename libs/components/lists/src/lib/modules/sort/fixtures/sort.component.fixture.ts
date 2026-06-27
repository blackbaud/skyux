import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './sort.component.fixture.html',
  standalone: false,
})
export class SortTestComponent {
  public ariaLabel = input<string | undefined>(undefined);
  public initialState = input<number | undefined>(3);
  public showButtonText = input<boolean>(false);
  public sortOptions = [
    {
      id: 1,
      label: 'Assigned to (A - Z)',
      name: 'assignee',
      descending: false,
    },
    {
      id: 2,
      label: 'Assigned to (Z - A)',
      name: 'assignee',
      descending: true,
    },
    {
      id: 3,
      label: 'Date created (newest first)',
      name: 'date',
      descending: true,
    },
    {
      id: 4,
      label: 'Date created (oldest first)',
      name: 'date',
      descending: false,
    },
    {
      id: 5,
      label: 'Note title (A - Z)',
      name: 'title',
      descending: false,
    },
    {
      id: 6,
      label: 'Note title (Z - A)',
      name: 'title',
      descending: true,
    },
  ];

  public sortedItem: unknown;

  public sortItems(item: unknown): void {
    this.sortedItem = item;
  }
}
