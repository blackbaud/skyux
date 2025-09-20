import { Component } from '@angular/core';
import { SkyInlineDeleteModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

interface InlineRepeaterDemoItem {
  title: string;
  cost: string;
  description: string;
}

/**
 * @title Inline delete with repeater
 */
@Component({
  selector: 'app-layout-inline-delete-repeater-example',
  templateUrl: './example.component.html',
  imports: [SkyDropdownModule, SkyInlineDeleteModule, SkyRepeaterModule],
})
export class LayoutInlineDeleteRepeaterExampleComponent {
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

  public repeaterDemoItems = this.originalRepeaterDemoItems;
  protected repeaterDemoShownInlineDeletes: string[] = [];

  public showInlineDelete(title: string): void {
    this.repeaterDemoShownInlineDeletes.push(title);
  }

  protected deleteItem(title: string): void {
    this.repeaterDemoItems = this.repeaterDemoItems.filter(
      (exampleItem: InlineRepeaterDemoItem) => exampleItem.title !== title,
    );

    this.repeaterDemoShownInlineDeletes =
      this.repeaterDemoShownInlineDeletes.filter(
        (exampleItem: string) => exampleItem !== title,
      );
  }

  protected cancelDeletion(title: string): void {
    this.repeaterDemoShownInlineDeletes =
      this.repeaterDemoShownInlineDeletes.filter(
        (exampleItem: string) => exampleItem !== title,
      );
  }

  protected onResetClick(): void {
    this.repeaterDemoItems = this.originalRepeaterDemoItems;
    this.repeaterDemoShownInlineDeletes = [];
  }
}
