import { ListFilterModel } from '../../../list-filters/filter.model';
import { ListStateOrchestrator } from '../list-state.rxstate';

import { ListFiltersUpdateAction } from './update.action';

/**
 * @internal
 * @deprecated
 */
export class ListFiltersOrchestrator extends ListStateOrchestrator<
  ListFilterModel[]
> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(ListFiltersUpdateAction, this.update);
  }

  private update(
    state: ListFilterModel[],
    action: ListFiltersUpdateAction
  ): ListFilterModel[] {
    return [...action.filters];
  }
}
