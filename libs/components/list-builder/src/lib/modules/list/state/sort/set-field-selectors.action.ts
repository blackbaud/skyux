import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';

/**
 * @internal
 */
export class ListSortSetFieldSelectorsAction {
  constructor(public fieldSelectors: ListSortFieldSelectorModel[]) {}
}
