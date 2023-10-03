import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { Item } from './item';

let nextId = 0;

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [CommonModule, SkyDropdownModule, SkyRepeaterModule],
})
export class DemoComponent {
  protected items: Item[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift. We should call him to thank him.',
      status: 'Completed',
      isSelected: false,
    },
    {
      title: 'Send invitation to Spring Ball',
      note: "The Spring Ball is coming up soon. Let's get those invitations out!",
      status: 'Past due',
      isSelected: false,
    },
    {
      title: 'Assign prospects',
      note: 'There are 14 new prospects who are not assigned to fundraisers.',
      status: 'Due tomorrow',
      isSelected: false,
    },
    {
      title: 'Process gift receipts',
      note: 'There are 28 recent gifts that are not receipted.',
      status: 'Due next week',
      isSelected: false,
    },
  ];

  protected addItem(): void {
    this.items.push({
      title: 'New reminder ' + ++nextId,
      note: 'This is a new reminder',
      status: 'Active',
      isSelected: false,
    });
  }

  protected changeItems(tags: Item[]): void {
    console.log('Tags in order ', tags);
  }

  protected onActionClicked(buttonText: string): void {
    alert(buttonText + ' was clicked!');
  }

  protected removeItems(): void {
    this.items = this.items.filter((item) => !item.isSelected);
  }
}
