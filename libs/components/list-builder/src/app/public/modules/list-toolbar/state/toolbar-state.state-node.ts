import { Injectable } from '@angular/core';
import { StateNode } from 'microedge-rxstate/dist';
import { ListToolbarStateModel } from './toolbar-state.model';
import { ListToolbarStateDispatcher } from './toolbar-state.rxstate';
import { ListToolbarConfigOrchestrator } from './config/config.orchestrator';

@Injectable()
export class ListToolbarState extends StateNode<ListToolbarStateModel> {
  constructor(initialState: ListToolbarStateModel, dispatcher: ListToolbarStateDispatcher) {
    super(initialState, dispatcher);

    this
      .register('config', ListToolbarConfigOrchestrator)
      .begin();
  }
}
