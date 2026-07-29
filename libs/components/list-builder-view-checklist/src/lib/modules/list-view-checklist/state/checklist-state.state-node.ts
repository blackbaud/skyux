import { Injectable, inject } from '@angular/core';
import { StateNode } from '@skyux/list-builder-common';

import { ChecklistStateModel } from './checklist-state.model';
import { ChecklistStateDispatcher } from './checklist-state.rxstate';
import { ListViewChecklistItemsOrchestrator } from './items/items.orchestrator';

/**
 * @deprecated
 */
@Injectable()
export class ChecklistState extends StateNode<ChecklistStateModel> {
  constructor() {
    super(inject(ChecklistStateModel), inject(ChecklistStateDispatcher));

    this.register('items', ListViewChecklistItemsOrchestrator).begin();
  }
}
