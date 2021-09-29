import {
  Subject
} from 'rxjs';

/**
 * @internal
 */
export class StateDispatcher<TAction> extends Subject<TAction> { }
