import { BehaviorSubject, zip } from 'rxjs';
import { map as observableMap } from 'rxjs/operators';

import { StateDispatcher } from './state-dispatcher';

/**
 * @internal
 * @deprecated
 */
export class StateNode<T> extends BehaviorSubject<T> {
  private stateMap: { [stateKey: string]: any } = {};

  constructor(
    private initialState: T,
    private dispatcher: StateDispatcher<any>
  ) {
    super(initialState);
  }

  public register(stateKey: string, orchestrator: any) {
    this.stateMap[stateKey] = orchestrator;
    return this;
  }

  public reset() {
    this.next(this.initialState);
  }

  public begin() {
    const stateKeys: string[] = Object.keys(this.stateMap);
    const init: { [stateKey: string]: any } = this.initialState;

    const orchestrators = stateKeys.map((key) =>
      new this.stateMap[key]().scan(init[key], this.dispatcher)
    );

    zip
      .apply(this, orchestrators)
      .pipe(
        observableMap((s: any) => {
          const result: any = {};
          for (let i = 0; i < stateKeys.length; i++) {
            const key = stateKeys[i];
            result[key] = s[i];
          }

          return result;
        })
      )
      .subscribe((s: any) => this.next(s));
  }
}
