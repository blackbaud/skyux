import { GridStateOrchestrator } from '../grid-state.rxstate';

import {
  AsyncList
} from '@skyux/list-builder-common';

import { SkyGridColumnModel } from '@skyux/grids';

import {
  ListViewGridColumnsLoadAction
} from './load.action';

/**
 * @internal
 */
export class ListViewGridColumnsOrchestrator
  extends GridStateOrchestrator<AsyncList<SkyGridColumnModel>> {
  /* istanbul ignore next */
  constructor() {
    super();

    this
      .register(ListViewGridColumnsLoadAction, this.load);
  }

  private load(
    state: AsyncList<SkyGridColumnModel>,
    action: ListViewGridColumnsLoadAction): AsyncList<SkyGridColumnModel> {
    const newColumns = action.columns.map(g => new SkyGridColumnModel(g.template, g));

    if (action.refresh) {
      return new AsyncList<SkyGridColumnModel>([...newColumns], new Date());
    }

    return new AsyncList<SkyGridColumnModel>([...state.items, ...newColumns], new Date());
  }
}
