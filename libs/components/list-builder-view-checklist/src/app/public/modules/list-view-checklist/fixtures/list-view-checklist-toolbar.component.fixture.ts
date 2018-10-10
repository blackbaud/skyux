import {
  Component,
  Inject
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-checklist-toolbar.component.fixture.html'
})
export class ListViewChecklistToolbarTestComponent {
  public selectedItems: Map<string, boolean>;
  public selectMode: string = 'multiple';
  public showOnlySelected: boolean = false;

  constructor(@Inject('items') public items: any) {
  }

  public selectedItemsChange(selectedMap: Map<string, boolean>) {
    this.selectedItems = selectedMap;
  }
}
