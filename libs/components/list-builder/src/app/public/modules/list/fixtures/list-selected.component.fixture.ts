import { Component, ViewChild, Inject } from '@angular/core';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-selected.component.fixture.html')
})
export class ListSelectedTestComponent {
  @ViewChild(SkyListComponent)
  public list: SkyListComponent;

  public selectedItems: Map<string, boolean>;

  public selectedIds: Array<string> = ['1', '2'];

  constructor(@Inject('items') public items: any) {
  }

  public selectedChangeFunction(selectedItems: Map<string, boolean>) {
    this.selectedItems = selectedItems;
  }

}
