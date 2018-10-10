import { ListSearchSetSearchTextAction } from './set-search-text.action';
import { ListSearchSetFieldSelectorsAction } from './set-field-selectors.action';
import { ListSearchSetFunctionsAction } from './set-functions.action';

export class ListSearchSetOptionsAction {
  constructor(
    public searchTextAction: ListSearchSetSearchTextAction,
    public setFieldSelectorsAction: ListSearchSetFieldSelectorsAction,
    public setFunctionsAction: ListSearchSetFunctionsAction
  ) {}
}
