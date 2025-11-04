import { AsyncList } from '@skyux/list-builder-common';

import { SkyGridLegacyColumnModel } from '../../../grid/grid-column.model';
import { GridStateOrchestrator } from '../grid-state.rxstate';

import { ListViewDisplayedGridColumnsLoadAction } from './load.action';

/**
 * @internal
 * @deprecated
 */
export class ListViewDisplayedGridColumnsOrchestrator extends GridStateOrchestrator<
  AsyncList<SkyGridLegacyColumnModel>
> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(ListViewDisplayedGridColumnsLoadAction, this.load);
  }

  private load(
    state: AsyncList<SkyGridLegacyColumnModel>,
    action: ListViewDisplayedGridColumnsLoadAction,
  ): AsyncList<SkyGridLegacyColumnModel> {
    const newColumns = action.columns.map(
      (g) => new SkyGridLegacyColumnModel(g.template, g),
    );

    if (action.refresh) {
      return new AsyncList<SkyGridLegacyColumnModel>(
        [...newColumns],
        new Date(),
      );
    }

    return new AsyncList<SkyGridLegacyColumnModel>(
      [...state.items, ...newColumns],
      new Date(),
    );
  }
}
