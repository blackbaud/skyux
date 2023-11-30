import { Injectable } from '@angular/core';
import { StateNode } from '@skyux/list-builder-common';

import { ListToolbarConfigOrchestrator } from './config/config.orchestrator';
import { ListToolbarStateModel } from './toolbar-state.model';
import { ListToolbarStateDispatcher } from './toolbar-state.rxstate';

/**
 * @internal
 */
@Injectable()
export class ListToolbarState extends StateNode<ListToolbarStateModel> {
  constructor(
    initialState: ListToolbarStateModel,
    dispatcher: ListToolbarStateDispatcher
  ) {
    super(initialState, dispatcher);

    this.register('config', ListToolbarConfigOrchestrator).begin();
  }
}
