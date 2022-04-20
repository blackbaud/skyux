import { ListViewModel } from './view.model';

/**
 * @internal
 * @deprecated
 */
export class ListViewsLoadAction {
  constructor(public views: ListViewModel[]) {}
}
