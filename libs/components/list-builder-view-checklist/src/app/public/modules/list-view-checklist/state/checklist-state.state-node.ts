import {
  Injectable
} from '@angular/core';

import {
  StateNode
} from 'microedge-rxstate/dist';

import {
  ChecklistStateModel
} from './checklist-state.model';

import {
  ChecklistStateDispatcher
} from './checklist-state.rxstate';

import {
  ListViewChecklistItemsOrchestrator
} from './items/items.orchestrator';

@Injectable()
export class ChecklistState extends StateNode<ChecklistStateModel> {
  constructor(initialState: ChecklistStateModel, dispatcher: ChecklistStateDispatcher) {
    super(initialState, dispatcher);

    this.register('items', ListViewChecklistItemsOrchestrator)
      .begin();
  }
}
