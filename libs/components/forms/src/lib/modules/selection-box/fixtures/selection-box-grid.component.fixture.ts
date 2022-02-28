import { Component, ViewChild } from '@angular/core';

import { SkySelectionBoxGridComponent } from '../selection-box-grid.component';
import { SkySelectionBoxGridAlignItemsType } from '../types/selection-box-grid-align-items-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './selection-box-grid.component.fixture.html',
})
export class SelectionBoxGridTestComponent {
  public alignItems: SkySelectionBoxGridAlignItemsType;

  public firstBoxHeight: string = '500px';

  public dynamicDescription: string = 'description three';

  @ViewChild(SkySelectionBoxGridComponent, {
    read: SkySelectionBoxGridComponent,
    static: false,
  })
  public selectionBoxGrid: SkySelectionBoxGridComponent;
}
