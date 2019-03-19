import {
  Component,
  forwardRef,
  OnInit
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  Observable
} from 'rxjs/Observable';

import {
  ListState,
  ListStateDispatcher,
  ListSelectedSetItemSelectedAction
} from '../../public/modules/list/state';

import {
  ListViewComponent
} from '../../public/modules/list/list-view.component';

// Internal component only used to get at ListStateDispatcher.
@Component({
  selector: 'sky-list-view-visual',
  templateUrl: './list-view-visual.component.html',
  providers: [
    /* tslint:disable-next-line */
    { provide: ListViewComponent, useExisting: forwardRef(() => ListViewTestComponent) },
  ]
})
export class ListViewTestComponent extends ListViewComponent implements OnInit {

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

  public itemSelected(id: string): Observable<boolean> {
    return this.state.map(state => state.selected.item.selectedIdMap.get(id));
  }

  public setItemSelection(item: ListItemModel, event: any): void {
    this.dispatcher.next(new ListSelectedSetItemSelectedAction(item.id, event.target.checked));
  }

}
