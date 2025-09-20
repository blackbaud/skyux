import { BehaviorSubject } from 'rxjs';

import { ListStateDispatcher } from './state/list-state.rxstate';
import { ListState } from './state/list-state.state-node';

/**
 * The SKY UX-themed pagination control that displays list data across multiple pages.
 * @internal
 * @deprecated
 */
export abstract class ListPagingComponent {
  protected initialized = new BehaviorSubject<boolean>(false);
  protected state: ListState;
  protected dispatcher: ListStateDispatcher;

  constructor(state: ListState, dispatcher: ListStateDispatcher) {
    this.state = state;
    this.dispatcher = dispatcher;
  }
}
