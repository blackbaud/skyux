import { BehaviorSubject } from 'rxjs';

import { ListStateDispatcher } from './state/list-state.rxstate';
import { ListState } from './state/list-state.state-node';

/**
 * Provides a SKY UX-themed pagination control to display list data across multiple pages.
 * @internal
 */
export abstract class ListPagingComponent {
  protected initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  protected state: ListState;
  protected dispatcher: ListStateDispatcher;

  constructor(state: ListState, dispatcher: ListStateDispatcher) {
    this.state = state;
    this.dispatcher = dispatcher;
  }
}
