import { Observable } from 'rxjs';

export interface SkyWaitBlockingWrapArgs<T> {
  observable: Observable<T>;
}
