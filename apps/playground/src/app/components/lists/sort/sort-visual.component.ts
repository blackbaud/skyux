import { Component, NgModule } from '@angular/core';
import { SkySortModule } from '@skyux/lists';

@Component({
  selector: 'app-sort-visual',
  templateUrl: './sort-visual.component.html',
  standalone: false,
})
export class SortVisualComponent {
  public initialState = 3;
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

  public sortedItem: any;

  public sortItems(item: any): void {
    this.sortedItem = item;
  }
}

@NgModule({
  imports: [SkySortModule],
  declarations: [SortVisualComponent],
  exports: [SortVisualComponent],
})
export class SortVisualComponentModule {}
