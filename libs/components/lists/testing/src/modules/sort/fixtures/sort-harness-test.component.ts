import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyRepeaterModule, SkySortModule } from '@skyux/lists';

interface Item {
  title: string;
  note: string;
  assignee: string;
  date: Date;
}
interface SortOption {
  id: number;
  label: string;
  name: keyof Item;
  descending: boolean;
  dataSkyId?: string;
}

@Component({
  standalone: true,
  selector: 'test-sort-harness',
  templateUrl: './sort-harness-test.component.html',
  imports: [CommonModule, SkyRepeaterModule, SkySortModule, SkyToolbarModule],
})
export class SortHarnessTestComponent implements OnInit {
  protected initialState = 3;

  protected sortedItems: Item[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift. We should call to thank him.',
      assignee: 'Debby Fowler',
      date: new Date('12/22/2015'),
    },
    {
      title: 'Send invitation to ball',
      note: "The Spring Ball is coming up soon. Let's get those invitations out!",
      assignee: 'Debby Fowler',
      date: new Date('1/1/2016'),
    },
    {
      title: 'Clean up desk',
      note: 'File and organize papers.',
      assignee: 'Tim Howard',
      date: new Date('2/2/2016'),
    },
    {
      title: 'Investigate leads',
      note: 'Check out leads for important charity event funding.',
      assignee: 'Larry Williams',
      date: new Date('4/5/2016'),
    },
    {
      title: 'Send thank you note',
      note: 'Send a thank you note to Timothy for his donation.',
      assignee: 'Catherine Hooper',
      date: new Date('11/11/2015'),
    },
  ];

  protected sortOptions: SortOption[] = [
    {
      id: 1,
      label: 'Assigned to (A - Z)',
      name: 'assignee',
      descending: false,
      dataSkyId: 'assigned-a-z',
    },
    {
      id: 2,
      label: 'Assigned to (Z - A)',
      name: 'assignee',
      descending: true,
      dataSkyId: 'assigned-z-a',
    },
    {
      id: 3,
      label: 'Date created (newest first)',
      name: 'date',
      descending: true,
      dataSkyId: 'newest',
    },
    {
      id: 4,
      label: 'Date created (oldest first)',
      name: 'date',
      descending: false,
      dataSkyId: 'oldest',
    },
    {
      id: 5,
      label: 'Note title (A - Z)',
      name: 'title',
      descending: false,
      dataSkyId: 'title-a-z',
    },
    {
      id: 6,
      label: 'Note title (Z - A)',
      name: 'title',
      descending: true,
      dataSkyId: 'title-z-a',
    },
  ];

  public ngOnInit(): void {
    this.sortItems(this.sortOptions[2]);
  }

  protected sortItems(option: SortOption): void {
    this.sortedItems = this.sortedItems.sort((a, b) => {
      const descending = option.descending ? -1 : 1;
      const sortProperty: keyof typeof a = option.name;

      if (a[sortProperty] > b[sortProperty]) {
        return descending;
      } else if (a[sortProperty] < b[sortProperty]) {
        return -1 * descending;
      } else {
        return 0;
      }
    });
  }
}
