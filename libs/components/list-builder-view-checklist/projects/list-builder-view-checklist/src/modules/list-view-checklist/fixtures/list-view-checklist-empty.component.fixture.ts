import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyListViewChecklistComponent
} from '../list-view-checklist.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-checklist-empty.component.fixture.html'
})
export class ListViewChecklistEmptyTestComponent {
  public tempValue: string = undefined;

  @ViewChild(SkyListViewChecklistComponent)
  public checklist: SkyListViewChecklistComponent;
}
