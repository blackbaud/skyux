import {
  Subject
} from 'rxjs';

export class StateDispatcher<TAction> extends Subject<TAction> { }
