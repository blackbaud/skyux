import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

export class ListSortSetFieldSelectorsAction {
  constructor(public fieldSelectors: ListSortFieldSelectorModel[]) {}
}
