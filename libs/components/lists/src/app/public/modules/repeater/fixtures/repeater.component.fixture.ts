import { Component, ViewChild } from '@angular/core';

import { SkyRepeaterComponent } from '../repeater.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './repeater.component.fixture.html'
})
export class RepeaterTestComponent {
  @ViewChild(SkyRepeaterComponent)
  public repeater: SkyRepeaterComponent;

  public showContextMenu: boolean;

  public removeLastItem: boolean;

  public expandMode = 'single';

  public lastItemExpanded: boolean;
}
