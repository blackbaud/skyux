import { ListStateOrchestrator } from '../list-state.rxstate';
import { ListFilterModel } from '../../../list-filters/filter.model';
import { ListFiltersUpdateAction } from './update.action';

/**
 * @internal
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
