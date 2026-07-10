import { Injectable, inject } from '@angular/core';
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
  constructor() {
    super(inject(GridStateModel), inject(GridStateDispatcher));

    this.register('columns', ListViewGridColumnsOrchestrator)
      .register('displayedColumns', ListViewDisplayedGridColumnsOrchestrator)
      .begin();
  }
}
