import { Component, ViewChild } from '@angular/core';
import { SkyVerticalTabsetComponent } from './../vertical-tabset.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset-no-active.component.fixture.html'
})
export class VerticalTabsetNoActiveTestComponent {
  @ViewChild(SkyVerticalTabsetComponent)
  public tabset: SkyVerticalTabsetComponent;
}
