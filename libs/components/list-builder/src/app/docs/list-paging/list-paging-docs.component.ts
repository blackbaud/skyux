import {
  Component
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListItemsLoadAction,
  ListState,
  ListStateDispatcher
} from '../../public/public_api';

const dispatcher = new ListStateDispatcher();

const state = new ListState(dispatcher);

@Component({
  selector: 'app-list-paging-docs',
  templateUrl: './list-paging-docs.component.html',
  providers: [
    {
      provide: ListState,
      useValue: state
    },
    {
      provide: ListStateDispatcher,
      useValue: dispatcher
    }
  ]
})
export class ListPagingDocsComponent {

  constructor() {
    dispatcher.next(new ListItemsLoadAction([
      new ListItemModel('1', {}),
      new ListItemModel('2', {}),
      new ListItemModel('3', {}),
      new ListItemModel('4', {}),
      new ListItemModel('5', {}),
      new ListItemModel('6', {}),
      new ListItemModel('7', {})
    ], true));
  }

}
