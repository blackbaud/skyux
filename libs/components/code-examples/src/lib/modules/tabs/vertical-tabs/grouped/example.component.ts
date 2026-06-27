import { Component } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { TabGroup } from './group';

/**
 * @title Vertical tabs with grouped tabs
 */
@Component({
  selector: 'app-tabs-vertical-tabs-grouped-example',
  templateUrl: './example.component.html',
  imports: [SkyVerticalTabsetModule],
})
export class TabsVerticalTabsGroupedExampleComponent {
  protected groups: TabGroup[] = [
    {
      heading: 'Group 1',
      isOpen: false,
      isDisabled: false,
      subTabs: [
        { tabHeading: 'Group 1 — Tab 1', content: 'Group 1 — Tab 1 Content' },
        {
          tabHeading: 'Group 1 — Tab 2',
          content: 'Group 1 — Tab 2 Content',
          tabHeaderCount: 7,
        },
      ],
    },
    {
      heading: 'Group 2',
      isOpen: true,
      isDisabled: false,
      subTabs: [
        {
          tabHeading: 'Group 2 — Tab 1',
          content: 'Group 2 — Tab 1 Content',
          active: true,
        },
        {
          tabHeading: 'Group 2 — Tab 2 — Disabled',
          content: 'Group 2 — Tab 2 Content',
          disabled: true,
        },
      ],
    },
    {
      heading: 'Disabled',
      isOpen: false,
      isDisabled: true,
      subTabs: [],
    },
  ];
}
