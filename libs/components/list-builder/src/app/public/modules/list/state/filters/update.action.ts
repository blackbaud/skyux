import { ListFilterModel } from './filter.model';

export class ListFiltersUpdateAction {
  constructor(public filters: ListFilterModel[]) {}
}
