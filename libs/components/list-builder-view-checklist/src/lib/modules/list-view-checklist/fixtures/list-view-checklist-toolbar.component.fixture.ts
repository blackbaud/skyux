import { Component, Inject, ViewChild } from '@angular/core';

import { SkyCheckboxChange } from '@skyux/forms';

import { SkyListViewChecklistComponent } from '../list-view-checklist.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-checklist-toolbar.component.fixture.html',
})
export class ListViewChecklistToolbarTestComponent {
  public selectedItems: Map<string, boolean>;

  public selectMode: string = 'multiple';

  public showOnlySelected = false;

  @ViewChild(SkyListViewChecklistComponent)
  public checklist: SkyListViewChecklistComponent;

  constructor(@Inject('items') public items: any) {}

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
    let checkbox = new SkyCheckboxChange();
    checkbox.checked = checked;
    this.checklist.changeVisibleItems(checkbox);
  }
}
