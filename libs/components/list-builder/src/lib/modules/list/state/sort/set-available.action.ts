import { ListSortLabelModel } from './label.model';

/**
 * @internal
 */
export class ListSortSetAvailableAction {
  constructor(public available: ListSortLabelModel[]) {}
}
