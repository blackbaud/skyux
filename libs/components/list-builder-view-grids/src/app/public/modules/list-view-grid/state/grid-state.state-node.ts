import { Injectable } from '@angular/core';
import { StateNode } from 'microedge-rxstate/dist';
import { GridStateModel } from './grid-state.model';
import { GridStateDispatcher } from './grid-state.rxstate';
import { ListViewGridColumnsOrchestrator } from './columns/columns.orchestrator';
import {
  ListViewDisplayedGridColumnsOrchestrator
} from './displayed-columns/displayed-columns.orchestrator';

@Injectable()
export class GridState extends StateNode<GridStateModel> {
  constructor(initialState: GridStateModel, dispatcher: GridStateDispatcher) {
    super(initialState, dispatcher);

    this
      .register('columns', ListViewGridColumnsOrchestrator)
      .register('displayedColumns', ListViewDisplayedGridColumnsOrchestrator)
      .begin();
  }
}
