import { Injectable } from '@angular/core';
import { StateNode } from '@skyux/list-builder-common';

import { ChecklistStateModel } from './checklist-state.model';
import { ChecklistStateDispatcher } from './checklist-state.rxstate';
import { ListViewChecklistItemsOrchestrator } from './items/items.orchestrator';

/**
 * @deprecated
 */
@Injectable()
export class ChecklistState extends StateNode<ChecklistStateModel> {
  /* eslint-disable @angular-eslint/prefer-inject -- unit tests manually pair a specific `ChecklistStateModel`/`ChecklistStateDispatcher` instance with a new `ChecklistState` for isolated testing; converting to inject() would break that pattern. */
  constructor(
    initialState: ChecklistStateModel,
    dispatcher: ChecklistStateDispatcher,
  ) {
    /* eslint-enable @angular-eslint/prefer-inject */
    super(initialState, dispatcher);

    this.register('items', ListViewChecklistItemsOrchestrator).begin();
  }
}
