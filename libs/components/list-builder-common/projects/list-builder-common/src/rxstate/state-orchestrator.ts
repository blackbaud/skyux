import {
  Observable
} from 'rxjs';

import {
  scan
} from 'rxjs/operators';

/**
 * @internal
 */
export class StateOrchestrator<TStateNode, TAction> {

  private registeredActions: Array<any> = [];

  private registeredCallbacks: Array<(state: TStateNode, action: TAction, initialState?: any) => any> = [];

  public register(
    action: any,
    callback: (state: TStateNode, action: TAction, initialState?: any) => any
  ): StateOrchestrator<TStateNode, TAction> {

    if (this.registeredActions.indexOf(action) === -1) {
      this.registeredActions.push(action);
      this.registeredCallbacks.push(callback);
    }

    return this;
  }

  public scan(initialState: TStateNode, actions: Observable<TAction>): Observable<any> {
    /* tslint:disable-next-line:no-null-keyword */
    if (initialState == null) {
      throw new Error('Initial state for an orchestrator should never be null. Check your StateNode definition and registrations.');
    }

    return actions.pipe(
      scan((state: any, action: any) => {
        for (let i = 0; i < this.registeredActions.length; i++) {
          const a = this.registeredActions[i] as any;

          // length is seemingly arbitrary but it's a stopgap to prevent checking via constructor name when code is minified
          if (action instanceof a || (a.name.length > 4 && action.constructor.name === a.name)) {
            return this.registeredCallbacks[i].apply(this, [state, action, initialState]);
          }
        }

        return state;
      }, initialState)
    );
  }
}
