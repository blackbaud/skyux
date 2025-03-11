import { Component } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { TabGroup } from './group';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyVerticalTabsetModule],
})
export class DemoComponent {
  protected groups: TabGroup[] = [
    {
      heading: 'Group 1',
      isOpen: false,
      isDisabled: false,
      subTabs: [],
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
