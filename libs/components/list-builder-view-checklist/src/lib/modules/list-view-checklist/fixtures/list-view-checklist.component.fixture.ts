import { Component, ViewChild } from '@angular/core';

import { SkyListViewChecklistComponent } from '../list-view-checklist.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-checklist.component.fixture.html',
  standalone: false,
})
export class ListViewChecklistTestComponent {
  @ViewChild(SkyListViewChecklistComponent)
  public checklist: SkyListViewChecklistComponent;
}
