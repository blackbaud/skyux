import { Component, ViewChild, inject } from '@angular/core';

import { SkyListViewChecklistComponent } from '../list-view-checklist.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-checklist-toolbar.component.fixture.html',
  standalone: false,
})
export class ListViewChecklistToolbarTestComponent {
  public selectedItems: Map<string, boolean>;

  public selectMode = 'multiple';

  public showOnlySelected = false;

  @ViewChild(SkyListViewChecklistComponent)
  public checklist: SkyListViewChecklistComponent;

  public readonly items: any = inject('items' as any);

  public selectedItemsChange(selectedMap: Map<string, boolean>): void {
    this.selectedItems = selectedMap;
  }

  public selectAll(): void {
    this.checklist.selectAll();
  }

  public clearAll(): void {
    this.checklist.clearSelections();
  }

  public changeVisibleItems(checked: boolean): void {
    this.checklist.changeVisibleItems({ checked });
  }
}
