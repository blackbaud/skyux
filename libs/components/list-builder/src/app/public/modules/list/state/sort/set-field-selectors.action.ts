import {
  ListSortFieldSelectorModel
} from './field-selector.model';

export class ListSortSetFieldSelectorsAction {
  constructor(public fieldSelectors: ListSortFieldSelectorModel[]) {}
}
