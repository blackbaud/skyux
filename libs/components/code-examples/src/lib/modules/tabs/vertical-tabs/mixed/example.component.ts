import { Component } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

/**
 * @title Vertical tabs with grouped and ungrouped tabs
 */
@Component({
  selector: 'app-tabs-vertical-tabs-mixed-example',
  templateUrl: './example.component.html',
  imports: [SkyVerticalTabsetModule],
})
export class TabsVerticalTabsMixedExampleComponent {
  protected groupedTabs = [
    {
      heading: 'Group 1',
      isOpen: true,
      subTabs: [
        { 
          tabHeading: 'Group 1 — Tab 1', 
          content: 'Group 1 — Tab 1 Content',
          active: true,
        },
        { 
          tabHeading: 'Group 1 — Tab 2', 
          content: 'Group 1 — Tab 2 Content',
        },
      ],
    },
    {
      heading: 'Group 2',
      isOpen: false,
      subTabs: [
        { 
          tabHeading: 'Group 2 — Tab 1', 
          content: 'Group 2 — Tab 1 Content',
        },
        { 
          tabHeading: 'Group 2 — Tab 2', 
          content: 'Group 2 — Tab 2 Content',
        },
      ],
    },
  ];
}