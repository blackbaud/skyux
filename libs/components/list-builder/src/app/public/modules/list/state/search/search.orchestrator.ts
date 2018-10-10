import { ListStateOrchestrator } from '../list-state.rxstate';
import { ListSearchModel } from './search.model';
import { ListSearchSetSearchTextAction } from './set-search-text.action';
import { ListSearchSetFunctionsAction } from './set-functions.action';
import { ListSearchSetFieldSelectorsAction } from './set-field-selectors.action';
import { ListSearchSetOptionsAction } from './set-options.action';

export class ListSearchOrchestrator extends ListStateOrchestrator<ListSearchModel> {
  /* istanbul ignore next */
  constructor() {
    super();

    this
      .register(ListSearchSetSearchTextAction, this.setSearchText)
      .register(ListSearchSetFunctionsAction, this.setFunctions)
      .register(ListSearchSetFieldSelectorsAction, this.setFieldSelectors)
      .register(ListSearchSetOptionsAction, this.setOptions);
   }

  private setSearchText(
    state: ListSearchModel,
    action: ListSearchSetSearchTextAction): ListSearchModel {
    return new ListSearchModel(
      Object.assign({}, state, { searchText: action.searchText ? action.searchText : '' })
    );
  }

  private setFunctions(
    state: ListSearchModel,
    action: ListSearchSetFunctionsAction): ListSearchModel {
    return new ListSearchModel(Object.assign({}, state, { functions: [...action.functions] }));
  }

  private setFieldSelectors(
    state: ListSearchModel,
    action: ListSearchSetFieldSelectorsAction): ListSearchModel {
    return new ListSearchModel(
      Object.assign({}, state, { fieldSelectors: [...action.fieldSelectors] })
    );
  }

  private setOptions(state: ListSearchModel, action: ListSearchSetOptionsAction) {
    let result = state;

    /* istanbul ignore else */
    if (action.searchTextAction) {
      result = this.setSearchText(result, action.searchTextAction);
    }

    /* istanbul ignore else */
    if (action.setFieldSelectorsAction) {
      result = this.setFieldSelectors(result, action.setFieldSelectorsAction);
    }

    /* istanbul ignore else */
    if (action.setFunctionsAction) {
      result = this.setFunctions(result, action.setFunctionsAction);
    }

    return result;
  }
}
