import { Component, ViewChild } from '@angular/core';

import { SkyVerticalTabsetComponent } from './../vertical-tabset.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset-no-active.component.fixture.html',
  standalone: false,
})
export class VerticalTabsetNoActiveTestComponent {
  public maintainTabContent = false;

  @ViewChild(SkyVerticalTabsetComponent)
  public tabset: SkyVerticalTabsetComponent | undefined;
}
