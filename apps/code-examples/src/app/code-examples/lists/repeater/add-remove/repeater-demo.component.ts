import { Component } from '@angular/core';

import { RepeaterDemoItem } from './repeater-demo-item';

let nextId = 0;

@Component({
  selector: 'app-repeater-demo',
  templateUrl: './repeater-demo.component.html',
  styleUrls: ['./repeater-demo.component.scss'],
})
export class RepeaterDemoComponent {
  public items: RepeaterDemoItem[] = [
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

  public addItem(): void {
    this.items.push({
      title: 'New reminder ' + ++nextId,
      note: 'This is a new reminder',
      status: 'Active',
      isSelected: false,
    });
  }

  public changeItems(tags: RepeaterDemoItem[]): void {
    console.log('Tags in order ', tags);
  }

  public onActionClicked(buttonText: string): void {
    alert(buttonText + ' was clicked!');
  }

  public removeItems(): void {
    this.items = this.items.filter((item) => !item.isSelected);
  }
}
