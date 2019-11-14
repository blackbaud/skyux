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

  public set activeIndex(value: number) {
    this._activeIndex = value;
  }

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public expandMode = 'single';

  public items: string[] = [ 'Item 1', 'Item 2', 'Item 3' ];

  public lastItemExpanded: boolean;

  public lastItemSelected = false;

  public removeLastItem: boolean;

  public reorderable = false;

  public selectable = false;

  public showContextMenu: boolean;

  public showDynamicContent: boolean;

  public showItemWithNoContent: boolean;

  public showRepeaterWithActiveIndex = false;

  public showRepeaterWithNgFor = false;

  @ViewChild(SkyRepeaterComponent)
  public repeater: SkyRepeaterComponent;

  private _activeIndex: number;

  public onCollapse(): void {}

  public onExpand(): void {}
}
