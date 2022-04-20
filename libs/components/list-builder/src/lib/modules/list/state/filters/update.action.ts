import { ListFilterModel } from '../../../list-filters/filter.model';

/**
 * @internal
 * @deprecated
 */
export class ListFiltersUpdateAction {
  constructor(public filters: ListFilterModel[]) {}
}
