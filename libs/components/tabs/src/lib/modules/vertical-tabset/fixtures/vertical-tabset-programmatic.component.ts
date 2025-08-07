import { Component } from '@angular/core';

import { SkyVerticalTabsetModule } from '../vertical-tabset.module';

@Component({
  template: `<sky-vertical-tabset>
    <sky-vertical-tab tabHeading="Tab 1" [active]="activeIndex === 0">
      Tab 1 content
    </sky-vertical-tab>
    <sky-vertical-tab tabHeading="Tab 2" [active]="activeIndex === 1">
      Tab 2 content
    </sky-vertical-tab>
    <sky-vertical-tab tabHeading="Tab 3" [active]="activeIndex === 2">
      Tab 3 content
    </sky-vertical-tab>
  </sky-vertical-tabset>`,
  imports: [SkyVerticalTabsetModule],
})
export class VerticalTabsetProgrammaticTestComponent {
  public activeIndex = 0;
}
