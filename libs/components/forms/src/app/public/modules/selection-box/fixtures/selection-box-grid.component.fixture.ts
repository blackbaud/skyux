import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkySelectionBoxGridComponent
} from '../selection-box-grid.component';

import {
  SkySelectionBoxGridAlignItems
} from '../types/selection-box-grid-align-items';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './selection-box-grid.component.fixture.html'
})
export class SelectionBoxGridTestComponent {

  public alignItems: SkySelectionBoxGridAlignItems;

  public firstBoxHeight: string = '500px';

  @ViewChild(SkySelectionBoxGridComponent, {
    read: SkySelectionBoxGridComponent,
    static: false
  })
  public selectionBoxGrid: SkySelectionBoxGridComponent;

}
