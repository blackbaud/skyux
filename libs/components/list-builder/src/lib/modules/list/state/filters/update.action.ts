import { ListFilterModel } from '../../../list-filters/filter.model';

/**
 * @internal
 */
export class ListFiltersUpdateAction {
  constructor(public filters: ListFilterModel[]) {}
}
