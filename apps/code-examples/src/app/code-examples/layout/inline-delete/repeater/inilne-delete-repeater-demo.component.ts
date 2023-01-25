import { Component } from '@angular/core';

interface InlineRepeaterDemoItem {
  title: string;
  cost: string;
  description: string;
}

@Component({
  selector: 'app-inline-delete-repeater-demo',
  templateUrl: './inline-delete-repeater-demo.component.html',
})
export class InlineDeleteRepeaterDemoComponent {
  public originalRepeaterDemoItems: InlineRepeaterDemoItem[] = [
    {
      title: 'Individual',
      cost: '$75.00',
      description: '1 ticket',
    },
    {
      title: 'Foursome',
      cost: '$250.00',
      description: '4 tickets',
    },
    {
      title: 'Hole sponsor',
      cost: '$1,000.00',
      description: '8 tickets',
    },
  ];

  public repeaterDemoItems: InlineRepeaterDemoItem[] =
    this.originalRepeaterDemoItems;

  public repeaterDemoShownInlineDeletes: string[] = [];

  public showInlineDelete(title: string): void {
    this.repeaterDemoShownInlineDeletes.push(title);
  }

  public deleteItem(title: string): void {
    this.repeaterDemoItems = this.repeaterDemoItems.filter(
      (demoItem: InlineRepeaterDemoItem) => demoItem.title !== title
    );
    this.repeaterDemoShownInlineDeletes =
      this.repeaterDemoShownInlineDeletes.filter(
        (demoItem: string) => demoItem !== title
      );
  }

  public cancelDeletion(title: string): void {
    this.repeaterDemoShownInlineDeletes =
      this.repeaterDemoShownInlineDeletes.filter(
        (demoItem: string) => demoItem !== title
      );
  }

  public onResetClick(): void {
    this.repeaterDemoItems = this.originalRepeaterDemoItems;
    this.repeaterDemoShownInlineDeletes = [];
  }
}
