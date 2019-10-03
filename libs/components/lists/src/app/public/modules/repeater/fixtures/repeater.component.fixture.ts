import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyRepeaterComponent
} from '../repeater.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './repeater.component.fixture.html'
})
export class RepeaterTestComponent {

  public activeIndex: number = undefined;

  public reorderable = false;

  public expandMode = 'single';

  public lastItemExpanded: boolean;

  public lastItemSelected = false;

  public removeLastItem: boolean;

  public showContextMenu: boolean;

  @ViewChild(SkyRepeaterComponent)
  public repeater: SkyRepeaterComponent;

  public onCollapse(): void {}

  public onExpand(): void {}
}
