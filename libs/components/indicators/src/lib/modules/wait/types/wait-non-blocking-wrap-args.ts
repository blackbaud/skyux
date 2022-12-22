import { Observable } from 'rxjs';

export interface SkyWaitNonBlockingWrapArgs<T> {
  observable: Observable<T>;
}
