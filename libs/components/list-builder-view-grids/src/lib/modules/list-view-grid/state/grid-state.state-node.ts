import { Injectable } from '@angular/core';
import { StateNode } from '@skyux/list-builder-common';

import { ListViewGridColumnsOrchestrator } from './columns/columns.orchestrator';
import { ListViewDisplayedGridColumnsOrchestrator } from './displayed-columns/displayed-columns.orchestrator';
import { GridStateModel } from './grid-state.model';
import { GridStateDispatcher } from './grid-state.rxstate';

/**
 * @internal
 * @deprecated
 */
@Injectable()
export class GridState extends StateNode<GridStateModel> {
  /* istanbul ignore next */
  // eslint-disable-next-line @angular-eslint/prefer-inject -- unit tests manually pair a specific `GridStateModel`/`GridStateDispatcher` instance with a new `GridState` for isolated testing; converting to inject() would break that pattern.
  constructor(initialState: GridStateModel, dispatcher: GridStateDispatcher) {
    super(initialState, dispatcher);

    this.register('columns', ListViewGridColumnsOrchestrator)
      .register('displayedColumns', ListViewDisplayedGridColumnsOrchestrator)
      .begin();
  }
}
