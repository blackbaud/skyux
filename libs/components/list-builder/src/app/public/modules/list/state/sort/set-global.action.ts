import { ListSortLabelModel } from './label.model';

/**
 * @internal
 */
export class ListSortSetGlobalAction {
  constructor(public global: ListSortLabelModel[]) {}
}
