import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-repeater-scrollable-host',
  template: `
    <div style="overflow-y: auto; height: 300px;">
      <sky-repeater [reorderable]="true" (orderChange)="onOrderChange($event)">
        <sky-repeater-item tag="item1">
          <sky-repeater-item-title>Title 1</sky-repeater-item-title>
          <sky-repeater-item-content>Content 1</sky-repeater-item-content>
        </sky-repeater-item>
        <sky-repeater-item tag="item2">
          <sky-repeater-item-title>Title 2</sky-repeater-item-title>
          <sky-repeater-item-content>Content 2</sky-repeater-item-content>
        </sky-repeater-item>
      </sky-repeater>
    </div>
  `,
  standalone: false,
})
export class RepeaterScrollableHostTestComponent {
  public sortedItemTags: string[] | undefined;

  public onOrderChange(tags: string[]): void {
    this.sortedItemTags = tags;
  }
}
