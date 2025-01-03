import { Component } from '@angular/core';
import { SkyInlineDeleteModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

interface InlineRepeaterDemoItem {
  title: string;
  cost: string;
  description: string;
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDropdownModule, SkyInlineDeleteModule, SkyRepeaterModule],
})
export class DemoComponent {
  protected originalRepeaterDemoItems: InlineRepeaterDemoItem[] = [
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

  protected repeaterDemoItems = this.originalRepeaterDemoItems;
  protected repeaterDemoShownInlineDeletes: string[] = [];

  protected showInlineDelete(title: string): void {
    this.repeaterDemoShownInlineDeletes.push(title);
  }

  protected deleteItem(title: string): void {
    this.repeaterDemoItems = this.repeaterDemoItems.filter(
      (demoItem: InlineRepeaterDemoItem) => demoItem.title !== title,
    );

    this.repeaterDemoShownInlineDeletes =
      this.repeaterDemoShownInlineDeletes.filter(
        (demoItem: string) => demoItem !== title,
      );
  }

  protected cancelDeletion(title: string): void {
    this.repeaterDemoShownInlineDeletes =
      this.repeaterDemoShownInlineDeletes.filter(
        (demoItem: string) => demoItem !== title,
      );
  }

  protected onResetClick(): void {
    this.repeaterDemoItems = this.originalRepeaterDemoItems;
    this.repeaterDemoShownInlineDeletes = [];
  }
}
