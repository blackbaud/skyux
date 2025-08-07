import { Component, ViewChild } from '@angular/core';

import { SkySelectionBoxGridComponent } from '../selection-box-grid.component';
import { SkySelectionBoxGridAlignItemsType } from '../types/selection-box-grid-align-items-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './selection-box-grid.component.fixture.html',
  standalone: false,
})
export class SelectionBoxGridTestComponent {
  public alignItems: SkySelectionBoxGridAlignItemsType | undefined;

  public firstBoxHeight = '500px';

  public dynamicDescription = 'description three';

  // We had an issue where when there is an outer `ngIf` the internal responsive check may face a race condition. This allows us to test that.
  public render = true;

  @ViewChild(SkySelectionBoxGridComponent, {
    read: SkySelectionBoxGridComponent,
    static: false,
  })
  public selectionBoxGrid: SkySelectionBoxGridComponent | undefined;
}
