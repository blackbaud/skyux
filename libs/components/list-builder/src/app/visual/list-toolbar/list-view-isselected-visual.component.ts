import {
  Component,
  forwardRef,
  OnInit
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListState,
  ListStateDispatcher
} from '../../public/modules/list/state';

import {
  ListViewComponent
} from '../../public/modules/list/list-view.component';

// Internal component only used to get at ListStateDispatcher.
@Component({
  selector: 'sky-list-view-isselected-visual',
  templateUrl: './list-view-isselected-visual.component.html',
  providers: [
    /* tslint:disable-next-line */
    { provide: ListViewComponent, useExisting: forwardRef(() => ListViewIsSelectedTestComponent) },
  ]
})
export class ListViewIsSelectedTestComponent extends ListViewComponent implements OnInit {

  public localItems: ListItemModel[];

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher
  ) {
    super(state, 'Test View');

    state.map(s => s.items)
      .subscribe((items) => {
        this.localItems = items.items;
      });
  }

  public ngOnInit(): void {
    this.dispatcher.toolbarShowMultiselectToolbar(true);
  }

  public setItemSelection(): void {
    const selectedItemIds = this.localItems.filter(item => item.isSelected).map(item => item.id);
    this.dispatcher.setSelected(selectedItemIds, true);
  }

}
